import Project from "../models/project.model.js";
import WorkspaceMember from '../models/workspaceMember.model.js';
import ProjectMember from '../models/projectMember.model.js';
import Task from '../models/task.model.js';
import Requirement from "../models/requirement.model.js";

import mongoose from "mongoose";

const createProject = async (req, res) => {
    try {
        const { name, projectCode, description, goals, team, technologies, status, startDate, targetDate } = req.body;

        const code = projectCode;

        const userId = req.user.userId;
        const membership = req.membership;
        const workspaceId = req.workspaceId;

        if(!userId) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        if(membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin-Only operation!",
            });
        }

        if(!name || !code || !description || !startDate || !targetDate) {
            return res.status(400).json({
                success: false,
                message: "Invalid or insufficient details.",
            });
        }

        const project = await Project.findOne({
            code,
            workspaceId,
        });

        if (project) {
            return res.status(400).json({
                success: false,
                message: "Project code must be unique!. Try typing name again!",
            });
        }

        let newProject;
        let adminMembership;
        
        const session = await mongoose.startSession();
        
        try {
            session.startTransaction();

            newProject = new Project({
                name,
                code,
                description,
                goals,
                technologies,
                status,
                startDate,
                targetDate,
                createdBy: userId,
                workspaceId,
            });

            adminMembership = new ProjectMember({
                projectId: newProject._id,
                userId,
                role: "Project Manager",
                joinedAt: Date.now(),
            });

            if (team?.length > 0) {
                const newTeam = team.filter((member) => String(member.userId._id) !== String(userId))

                for(const member of newTeam) {
                    const newMembership = new ProjectMember({
                        projectId: newProject._id,
                        userId: member.userId._id,
                        role: "Developer",
                        joinedAt: Date.now(),
                    });

                    await newMembership.save({ session });
                }
            }

            await newProject.save({ session });
            await adminMembership.save({ session });

            await session.commitTransaction();

        } catch (error) {
            await session.abortTransaction();
            throw error;
        
        } finally {
            await session.endSession();
        }

        return res.status(201).json({
            success: true,
            message: "Project created successfully!",
            newProject,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        });
    }
}

const addProjectMembers = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { members } = req.body;

        const membership = req.membership;
        const workspaceId = req.workspaceId;

        // Basic validation
        if (
            !projectId ||
            !Array.isArray(members) ||
            members.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid or insufficient data",
            });
        }

        // Workspace Admin only
        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin-Only operation",
            });
        }

        // Verify project belongs to workspace
        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in the workspace!",
            });
        }

        // Validate each member payload
        for (const member of members) {
            if (!member.targetUserId || !member.role) {
                return res.status(400).json({
                    success: false,
                    message: "Each member must have a userId and role",
                });
            }
        }

        // Prevent duplicate users in same request
        const targetUserIds = members.map(
            (member) => String(member.targetUserId)
        );

        const uniqueUserIds = new Set(targetUserIds);

        if (uniqueUserIds.size !== targetUserIds.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate members are not allowed",
            });
        }

        // Verify all users are active workspace members
        const workspaceMemberships = await WorkspaceMember.find({
            workspaceId,
            userId: { $in: targetUserIds },
            status: "active",
        }).lean();

        if (workspaceMemberships.length !== targetUserIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more selected users are not active workspace members",
            });
        }

        // Check which users are already project members
        const existingMembers = await ProjectMember.find({
            projectId,
            userId: { $in: targetUserIds },
        }).lean();

        if (existingMembers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "One or more selected users are already project members",
            });
        }

        // Create project memberships
        const projectMembers = members.map((member) => ({
            projectId,
            userId: member.targetUserId,
            role: member.role,
            joinedAt: new Date(),
        }));

        const createdMembers = await ProjectMember.insertMany(
            projectMembers
        );

        return res.status(201).json({
            success: true,
            message: `${createdMembers.length} member(s) added to project successfully!`,
            projectMembers: createdMembers,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        });
    }
};

const removeProjectMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const targetUserId = req.params.userId;

        const membership = req.membership;
        const workspaceId = req.workspaceId;

        if(membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin-Only operation",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if(!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in the workspace",
            });
        }

        if(targetUserId.toString() === project.createdBy.toString()) { 
            return res.status(400).json({
                success: false,
                message: "Cannot remove the project creator!",
            })
        }

        const projectMember = await ProjectMember.findOneAndDelete({        
            userId: targetUserId, 
            projectId,
        });

        if(!projectMember) {
            return res.status(404).json({
                success: false,
                message: "Project member not found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project member removed successfully!",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        });
    }
}

const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const workspaceId =  req.workspaceId;
        
        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in the workspace",
            });
        }

        const [tasks, requirements, projectMemberships] = await Promise.all([
            Task.find({ projectId }).populate("assignee", "-password").lean(),
            Requirement.find({ projectId }).lean(),
            ProjectMember.find({ projectId }).populate("userId", "-password").lean(),
        ])

        const team = projectMemberships;
        
        return res.status(200).json({
            success: true,
            project: { ...project.toObject(), tasks, team, requirements },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}

const getAllProjects = async (req, res) => {
    try {
        const workspaceId = req.workspaceId;

        const projects = await Project.find({
            workspaceId,
        }).lean();

        const projectIds = projects.map(project => project._id);

        const tasks = await Task.find({ projectId: { $in: projectIds } }).lean();

        const members = await ProjectMember.find({
            projectId: { $in: projectIds },
        })
        .populate("userId", "name avatar")
        .lean();

        const projectsWithTeam = projects.map(project => ({
            ...project,
            team: members.filter(
                member => member.projectId.toString() === project._id.toString()
            ),
            tasks: tasks.filter(
                task => task.projectId.toString() === project._id.toString()
            )
        }));

        return res.status(200).json({
            success: true,
            projects: projectsWithTeam,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

const getProjectMembers = async (req, res) => {
    try {
        const { projectId } = req.params;
        const workspaceId = req.workspaceId;

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in the workspace!",
            });
        }

        const projectMembers = await ProjectMember.find({ projectId }).populate("userId", "-password");

        return res.status(200).json({
            success: true,
            projectMembers,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        })
    }
}

const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const workspaceId = req.workspaceId;
        const membership = req.membership;

        if(membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin-Only operation",
            });
        }

        const allowedFields = [
            "name",
            "description",
            "goals",
            "technologies",
            "status",
            "startDate",
            "targetDate",
        ];

        const updateFields = {};

        const hasTeamUpdate = Array.isArray(req.body.team);

        for(const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        }

        if (Object.keys(updateFields).length === 0 && !hasTeamUpdate) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update.",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found!",
            });
        }

        const session = await mongoose.startSession();
        let updatedProject;

        try {
            session.startTransaction();

            if (Object.keys(updateFields).length > 0) {
                updatedProject = await Project.findOneAndUpdate(
                    {
                        _id: projectId,
                        workspaceId,
                    },
                    {
                        $set: updateFields,
                    },
                    {
                        new: true,
                        session,
                    },
                );
            } else {
                updatedProject = project;
            }

            if (hasTeamUpdate) {
                const requestedUserIds = req.body.team
                    .map((member) => member?.userId?._id || member?.userId)
                    .filter(Boolean)
                    .map((id) => String(id));

                const workspaceMembers = await WorkspaceMember.find({
                    workspaceId,
                    status: "active",
                    userId: { $in: requestedUserIds },
                }).session(session);

                const validUserIds = new Set(
                    workspaceMembers.map((member) => String(member.userId))
                );

                if (requestedUserIds.some((id) => !validUserIds.has(id))) {
                    await session.abortTransaction();
                    return res.status(400).json({
                        success: false,
                        message: "All project members must belong to the workspace.",
                    });
                }

                const memberUserIds = [...new Set(
                    requestedUserIds.filter((id) => id !== String(project.createdBy))
                )];

                await ProjectMember.deleteMany({
                    projectId,
                    userId: { $ne: project.createdBy },
                }, { session });

                if (memberUserIds.length > 0) {
                    await ProjectMember.insertMany(
                        memberUserIds.map((userId) => ({
                            projectId,
                            userId,
                            role: "Developer",
                            joinedAt: Date.now(),
                        })),
                        { session },
                    );
                }
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully!",
            updatedProject,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        if(membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin-Only operation",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in the workspace",
            });
        }

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            await Project.findByIdAndDelete(
                projectId,
                { session },
            );

            await ProjectMember.deleteMany(
                { projectId },
                { session },
            );     

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: "Project deleted successfully!",
            })

        } catch (error) {
            await session.abortTransaction();
            throw error;

        } finally {
            await session.endSession();

        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}


export {
    createProject,
    addProjectMembers,
    removeProjectMember,
    getProject,
    getAllProjects,
    getProjectMembers,
    updateProject,
    deleteProject,
}
