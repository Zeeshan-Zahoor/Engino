import Project from "../models/project.model.js";
import WorkspaceMember from '../models/workspaceMember.model.js';
import ProjectMember from '../models/projectMember.model.js';

import mongoose from "mongoose";

const createProject = async (req, res) => {
    try {
        const { name, code, description, goals, technologies, status, startDate, targetDate } = req.body;

        const userId = req.user.userId;

        if(!userId) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        const membership = await WorkspaceMember.findOne({ userId, status: "active" });

        if(!membership) {
            return res.status(404).json({
               success: false,
               message: "No active membership found!", 
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
                workspaceId: membership.workspaceId,
            });

            projectMembership = new ProjectMember({
                projectId: newProject._id,
                userId,
                role: membership.role,
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

export {
    createProject,
}