import bcrypt from "bcryptjs";
import Invitation from "../models/invitation.model.js";
import User from "../models/user.model.js";
import Workspace from "../models/workspace.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";
import Requirement from "../models/requirement.model.js";
import AIPlan from "../models/aiPlan.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import transporter from "../utils/mail.js";
import getDashboardInsights from "../services/dashboardInsights.service.js";

import mongoose from "mongoose";

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { extractRequirement } from "../services/ai/requirementExtraction.service.js";
import { exploreWithAI } from "../services/ai/exploreAI.service.js";

const getWorkspace = async (req, res) => {
    try {
        const workspaceId = req.workspaceId;
        const workspace = await Workspace.findById(workspaceId);

        if(!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found!",
            });
        }

        return res.status(200).json({
            success: true,
            workspace,
        });
        
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Internal Server Error",
        })
    }
}

const getWorkspaces = async (req, res) => {
    try {
        const userId = req.user.userId;

        const memberships = await WorkspaceMember.find({ userId }).populate("workspaceId").lean();

        if (memberships.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found in any workspace",
            });
        }

        const workspaces = memberships.map((membership) => ({
            ...membership.workspaceId,
            role: membership.role,
        }));

        return res.status(200).json({
            success: true,
            workspaces,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const sendInvitation = async (req, res) => {
    try {
        const { email, role } = req.body;
        const userId = req.user.userId;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin-Only operation",
            });
        }

        if(!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty email",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!["Admin", "Member"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid workspace role",
            });
        }

        const workspace = await Workspace.findById(workspaceId);

        if(!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found!",
            });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if(user) {
            const isMember = await WorkspaceMember.findOne({ 
                userId: user._id, 
                workspaceId,
            });

            if(isMember) {
                return res.status(400).json({
                    success: false,
                    message: "Already a member of the workspace",
                });
            }
        }

        const invitationExists = await Invitation.findOne({ email: normalizedEmail, workspaceId });

        if(invitationExists && invitationExists.expiresAt > new Date() && invitationExists.status === "Pending") {
            return res.status(400).json({
                success: false,
                message: "This email has already an active invitation",
            });
        }

        const token = crypto.randomBytes(32).toString('hex');

        const invitation = new Invitation({
            email: normalizedEmail,
            workspaceId,
            invitedBy: userId,
            role,
            token,
            status: "Pending",
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await invitation.save();

        // send the invitation
        const invitationLink = `${process.env.FRONTEND_URL}/invitations/${token}`;
        
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: normalizedEmail,
                subject: `Engino Invitation from ${workspace.name}`,
                text: `You have been invited to join our workspace as ${role}.`,
                html: `
                    <h2>You're invited to join Engino!</h2>

                    <p>
                        You have been invited to join a workspace as an <strong>${role}</strong>.
                    </p>

                    <a
                        href="${invitationLink}"
                        style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#000;
                            color:#fff;
                            text-decoration:none;
                            border-radius:6px;
                        "
                    >
                        View Invitation
                    </a>

                    <p>This invitation will expire in 24 hours.</p>
                `,
            })
        } catch (error) {
            await Invitation.findByIdAndDelete(invitation._id);
            throw error;
        }

        return res.status(201).json({
            success: true,
            message: "Invitation sent successfully!",
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Internal Server Error",
        });
    }
}

const acceptInvitation = async (req, res) => {
    try {
        const { token, name, password } = req.body;
        
        const invitation = await Invitation.findOne({ token });

        if(!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found!",
            });
        }

        if(invitation.expiresAt <= new Date()) {
            return res.status(400).json({
                message: "Invitation has expired",
                success: false,
            });
        }

        if(invitation.status !== "Pending") {
            if(invitation.status === "Declined") {
                return res.status(400).json({
                    message: "Invitation already declined",
                    success: false,
                });
            } else {
                return res.status(400).json({
                    message: "Invitation already accepted",
                    success: false,
                });
            }
        }

        const user = await User.findOne({ email: invitation.email });
        
        let memberUser;
        
        if(user) {
            const isAlreadyMember = await WorkspaceMember.findOne({ 
                userId: user._id,
                workspaceId: invitation.workspaceId,
            })
            
            if(isAlreadyMember) {
                return res.status(400).json({
                    success: false,
                    message: "User already in the workspace",
                });
            }
            
            memberUser = user;
        } else {
            if(!name || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or insufficient credentials",
                });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            memberUser = new User ({
                name,
                email: invitation.email,
                password: hashedPassword,
            });
        }
        
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            if(!user) await memberUser.save({ session });
            
            const membership = new WorkspaceMember({
                workspaceId: invitation.workspaceId,
                userId: memberUser._id,
                role: invitation.role,
                status: "active",
                invitedBy: invitation.invitedBy,
                joinedAt: Date.now(),
            })

            invitation.status = "Accepted";

            await membership.save({ session });
            await invitation.save({ session });

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw error;

        } finally {
            await session.endSession();

        }

        // JWT token for authomatic login on acceptance
        const jwt_token = jwt.sign(
            { userId: memberUser._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            },
        )

        res.cookie(
            'authToken',
            jwt_token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            },
        )

        return res.status(201).json({
            success: true,
            message: "Invitation accepted successfully",
            user: { ...memberUser.toObject(), password: undefined },
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Internal Server Error",
        });
    }
}

const getInvitation = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required",
            });
        }

        const invitation = await Invitation.findOne({ token })
        .populate("workspaceId")
        .populate("invitedBy", "-password");

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found!",
            });
        } 

        return res.status(200).json({
            success: true,
            invitation,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const declineInvitation = async (req, res) => {
    try {
        const { token } = req.body;

        const invitation = await Invitation.findOne({ token });
        if(!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found!",
            });
        }

        if (invitation.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Invitation already expired, no actions needed",
            });
        }

        if (invitation.status === "Accepted") {
            return res.status(400).json({
                success: false,
                message: "Invitation already accepted",
            });
        } else if (invitation.status === "Declined") {
            return res.status(400).json({
                success: false,
                message: "Invitation already declined",
            });
        } else if (invitation.status === "Pending") {
            invitation.status = "Declined";
        }

        await invitation.save();
        
        return res.status(200).json({
            success: true,
            message: "Invitation declined successfully!",
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
            message: "Internal Server Error",
        });
    }
}

const updateWorkspaceMemberRole = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const { role } = req.body;
    const membership = req.membership;

    if (membership.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin-Only operation",
      });
    }

    if (!["Admin", "Member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace role",
      });
    }

    const targetMembership = await WorkspaceMember.findOne({
      workspaceId,
      userId,
    });

    if (!targetMembership) {
      return res.status(404).json({
        success: false,
        message: "Workspace member not found",
      });
    }

    // Prevent an admin from accidentally removing
    // the last remaining admin.
    if (
      targetMembership.role === "Admin" &&
      role === "Member"
    ) {
      const adminCount = await WorkspaceMember.countDocuments({
        workspaceId,
        role: "Admin",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "The workspace must have at least one admin",
        });
      }
    }

    targetMembership.role = role;
    await targetMembership.save();

    const updatedMembership =
      await WorkspaceMember.findById(targetMembership._id)
        .populate("userId", "-password");

    return res.status(200).json({
      success: true,
      message: "Workspace member role updated successfully",
      workspaceMember: updatedMembership,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
}

const removeWorkspaceMember = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const membership = req.membership;

    if (membership.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin-Only operation",
      });
    }

    const targetMembership = await WorkspaceMember.findOne({
      workspaceId,
      userId,
    });

    if (!targetMembership) {
      return res.status(404).json({
        success: false,
        message: "Workspace member not found",
      });
    }

    // Prevent an admin from removing themselves.
    if (userId === req.user.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself from the workspace",
      });
    }

    // Prevent removing the last admin.
    if (targetMembership.role === "Admin") {
      const adminCount = await WorkspaceMember.countDocuments({
        workspaceId,
        role: "Admin",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "The workspace must have at least one admin",
        });
      }
    }

    // Find projects belonging to this workspace.
    const projectIds = await Project.distinct("_id", {
      workspaceId,
    });

    // Remove the member from all projects first.
    await Project.updateMany(
      {
        _id: { $in: projectIds },
        "team.userId": userId,
      },
      {
        $pull: {
          team: {
            userId,
          },
        },
      }
    );

    // Unassign their tasks instead of deleting them.
    await Task.updateMany(
      {
        projectId: { $in: projectIds },
        assignee: userId,
      },
      {
        $set: {
          assignee: null,
        },
      }
    );

    await WorkspaceMember.deleteOne({
      _id: targetMembership._id,
    });

    return res.status(200).json({
      success: true,
      message: "Workspace member removed successfully",
      userId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

const getWorkspaceMembers = async (req, res) => {
    try {
        const workspaceId = req.workspaceId;

        // get all members of the workspace
        const workspaceMembers = await WorkspaceMember.find({ workspaceId }).populate("userId", "-password");

        return res.status(200).json({
            success: true,
            workspaceMembers,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        });
    }
}

const getAllAIPlans = async (req, res) => {
    try {
        const workspaceId = req.workspaceId;
        
        const projectIds = await Project.distinct("_id", { workspaceId });
        const requirementIds = await Requirement.distinct("_id", { 
            projectId: { $in: projectIds },
         })

        const aiPlans = await AIPlan.find({
            requirementId: { $in: requirementIds },
        })
        .sort({ createdAt: -1 })
        .lean();

        return res.status(200).json({
            success: true,
            aiPlans,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error."
        });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const workspaceId = req.workspaceId;
        
        const projectIds = await Project.distinct("_id", { workspaceId });

        const allTasks = await Task.find({
            projectId: { $in: projectIds },
        })
        .populate("assignee reporter")
        .sort({ createdAt: -1 })
        .lean();

        return res.status(200).json({
            success: true,
            allTasks,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error."
        });
    }
}

const getAllRequirements = async (req, res) => {
    try {
        const workspaceId = req.workspaceId;
        
        const projectIds = await Project.distinct("_id", { workspaceId });

        const requirements = await Requirement.find({
            projectId: { $in: projectIds },
        })
        .populate("owner updatedBy")
        .sort({ createdAt: -1 })
        .lean();

        return res.status(200).json({
            success: true,
            requirements,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error."
        });
    }
}

const extractRequirementData = async (req, res) => {
    try {
        const membership = req.membership;
        const { prompt } = req.body;

        if(membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin only action.",
            });
        }

        const extractedRequirement = await extractRequirement(prompt);

        if(!extractedRequirement) {
            return res.status(400).json({
                success: false,
                message: "Failed to extract requirement data. Try again.",
            });
        }

        return res.status(200).json({
            success: true,
            requirementData: extractedRequirement,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
        });
    }
}

const exploreWithAIWorkspace = async (req, res) => {
    try {
        const { prompt, conversation } = req.body;

        if(!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required!",
            });
        }

        const exploreResponse = await exploreWithAI(prompt.trim(), conversation || []);

        if(!exploreResponse) {
            return res.status(400).json({
                success: false,
                message: "AI exploration failed. Try again!",
            });
        }

        return res.status(200).json({
            success: true,
            aiResponse: exploreResponse,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error.",
        });
    }
}

const getInsights = async (req, res) => {
    try {
        const workspaceId = req.workspaceId;
        const userId = req.user.userId;
        const role = req.membership.role;

        const insights = await getDashboardInsights(
            workspaceId,
            userId,
            role  
        );
        
        return res.status(200).json({
            success: true,
            insights,
        });
 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard insights.",
            error: error.message,
        });
    }
}

export {
    getWorkspace,
    getWorkspaces,
    getInvitation,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
    updateWorkspaceMemberRole,
    removeWorkspaceMember,
    getWorkspaceMembers,
    getAllAIPlans,
    getAllTasks,
    getAllRequirements,
    getInsights,
    extractRequirementData,
    exploreWithAIWorkspace,
}