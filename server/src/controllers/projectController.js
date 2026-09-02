import Project from "../models/project.model.js";
import WorkspaceMember from '../models/workspaceMember.model.js';
import ProjectMember from '../models/projectMember.model.js';

import mongoose from "mongoose";

const createProject = async (req, res) => {
    try {
        const { name, code, description, goals, technologies, status, startDate, targetDate } = req.body;

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

        let newProject;
        let projectMembership;
        
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

            projectMembership = new ProjectMember({
                projectId: newProject._id,
                userId,
                role: "Project Manager",
                joinedAt: Date.now(),
            });

            await newProject.save({ session });
            await projectMembership.save({ session });

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

const addProjectMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { targetUserId, role } = req.body;

        const membership = req.membership;
        const workspaceId = req.workspaceId;

        if(!projectId || !targetUserId || !role) {
            return res.status(400).json({
                success: false,
                message: "Invalid or insufficient data",
            });
        }

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
                message: "Project not found in the workspace!",
            });
        }

        const targetUserMembership = await WorkspaceMember.findOne({ 
            userId: targetUserId,
            workspaceId,
            status: "active",
        });

        if(!targetUserMembership) {
            return res.status(404).json({
                success: false,
                message: "No active target user found in workspace",
            });
        }

        const alreadyInProject = await ProjectMember.findOne({ 
            projectId,
            userId: targetUserId,
        });

        if(alreadyInProject) {
            return res.status(400).json({
                success: false,
                message: "Target user already in the project",
            });
        }

        const newProjectMember = new ProjectMember({
            projectId,
            userId: targetUserId,
            role,
            joinedAt: Date.now(),
        });
        
        await newProjectMember.save();

        return res.status(201).json({
            success: true,
            message: "User added to project successfully!",
            newProjectMember,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        })
    }
}

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

        return res.status(200).json({
            success: true,
            project,
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
        });

        return res.status(200).json({
            success: true,
            projects,
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
            "code",
            "description",
            "goals",
            "technologies",
            "status",
            "startDate",
            "targetDate",
        ];

        const updateFields = {};

        for(const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        }

        const updatedProject = await Project.findOneAndUpdate(
            { 
                _id: projectId,
                workspaceId,
            },
            { 
                $set: updateFields,
            },
            { 
                new: true,
            },
        );

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found!",
            });
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
    addProjectMember,
    removeProjectMember,
    getProject,
    getAllProjects,
    getProjectMembers,
    updateProject,
    deleteProject,
}