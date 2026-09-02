import Requirement from '../models/requirement.model.js';
import Project from '../models/project.model.js';
import ProjectMember from '../models/projectMember.model.js';
import Task from '../models/task.model.js';
import mongoose from 'mongoose';

const createRequirement = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        const { name, description, owner, complexity, acceptanceCriteria } = req.body;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required!",
            });
        }

        const ownerId = owner || userId;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required",
            });
        }

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only workspace admins can create requirements",
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

        const projectMember = await ProjectMember.findOne({
            projectId,
            userId: ownerId,
        });

        if (!projectMember) {
            return res.status(400).json({
                success: false,
                message: "Owner is not a member of the project",
            });
        }

        const requirement = new Requirement({
            projectId,
            name,
            description,
            owner: ownerId,
            complexity: complexity || "Medium",
            acceptanceCriteria: acceptanceCriteria || [],
            createdBy: userId,
            updatedBy: userId,
        });

        await requirement.save();

        return res.status(201).json({
            success: true,
            message: "Requirement created successfully!",
            requirement,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

const getAllRequirements = async (req, res) => {
    try {
        const { projectId } = req.params;
        const workspaceId = req.workspaceId;

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required!",
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

        const requirements = await Requirement.find({
            projectId,
        })
            .populate("owner", "-password")
            .populate("createdBy", "-password")
            .populate("updatedBy", "-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Requirements fetched successfully!",
            requirements,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

const getRequirement = async (req, res) => {
    try {
        const { projectId, requirementId } = req.params;
        const workspaceId = req.workspaceId;

        if (!projectId || !requirementId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and requirement ID are required!",
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

        const requirement = await Requirement.findOne({
            _id: requirementId,
            projectId,
        })
            .populate("owner", "-password")
            .populate("createdBy", "-password")
            .populate("updatedBy", "-password");

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found in the project",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Requirement fetched successfully!",
            requirement,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

const updateRequirement = async (req, res) => {
    try {
        const { projectId, requirementId } = req.params;
        const userId = req.user.userId;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        if (!projectId || !requirementId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and requirement ID are required!",
            });
        }

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only workspace admins can update requirements",
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

        const requirement = await Requirement.findOne({
            _id: requirementId,
            projectId,
        });

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found in the project",
            });
        }

        const allowedFields = [
            "name",
            "description",
            "owner",
            "complexity",
            "acceptanceCriteria",
            "status",
        ];

        const updateFields = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update",
            });
        }

        if (updateFields.owner !== undefined) {
            if (updateFields.owner === null) {
                return res.status(400).json({
                    success: false,
                    message: "Requirement owner cannot be null",
                });
            }

            const projectMember = await ProjectMember.findOne({
                projectId,
                userId: updateFields.owner,
            });

            if (!projectMember) {
                return res.status(400).json({
                    success: false,
                    message: "Owner is not a member of the project",
                });
            }
        }

        updateFields.updatedBy = userId;

        const updatedRequirement = await Requirement.findByIdAndUpdate(
            requirementId,
            { $set: updateFields },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("owner", "-password")
            .populate("createdBy", "-password")
            .populate("updatedBy", "-password");

        return res.status(200).json({
            success: true,
            message: "Requirement updated successfully!",
            requirement: updatedRequirement,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

const deleteRequirement = async (req, res) => {
    try {
        const { projectId, requirementId } = req.params;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        if (!projectId || !requirementId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and requirement ID are required!",
            });
        }

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only workspace admins can delete requirements",
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

        const requirement = await Requirement.findOne({
            _id: requirementId,
            projectId,
        });

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found in the project",
            });
        }

        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            await Requirement.findByIdAndDelete(requirementId, { session });

            await Task.updateMany(
                { requirementId },
                { 
                    $set: {
                        requirementId: null,
                    }
                },
                { session }
            );

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;

        } finally {
            await session.endSession();
        }

        return res.status(200).json({
            success: true,
            message: "Requirement deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

export {
    createRequirement,
    getAllRequirements,
    getRequirement,
    updateRequirement,
    deleteRequirement,
}