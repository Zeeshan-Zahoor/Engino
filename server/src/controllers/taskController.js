import Project from "../models/project.model.js";
import ProjectMember from "../models/projectMember.model.js";
import Task from "../models/task.model.js";
import Requirement from '../models/requirement.model.js'

const createTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { projectId } = req.params;
        const membership = req.membership;
        const workspaceId = req.workspaceId;

        const { title, description, priority, assignee, dueDate, estimatedEffortMinutes, type, complexity, tags, requirementId } = req.body;

        if (!title || !type || !complexity) {
            return res.status(400).json({
                success: false,
                message: "Invalid or insufficient details",
            });
        }

        if(membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Admin-Only operation!",
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

        if (assignee) {
            const projectMembership = await ProjectMember.findOne({ 
                projectId,
                userId: assignee,
            });

            if (!projectMembership) {
                return res.status(404).json({
                    success: false,
                    message: "Assignee is not the project member",
                });
            }
        }

        if (requirementId) {
            const requirement = await Requirement.findOne({
                _id: requirementId,
                projectId,
            });

            if (!requirement) {
                return res.status(404).json({
                    success: false,
                    message: "Requirement not found in the project!"
                });
            }
        }

        const newTask = new Task({
            projectId,
            requirementId,
            title,
            description,
            priority,
            assignee,
            reporter: userId,
            dueDate,
            estimatedEffortMinutes,
            type,
            complexity,
            tags,
        });

        await newTask.save();

        return res.status(201).json({
            success: true,
            message: "Task created successfully!",
            newTask,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { projectId } = req.params;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

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

        const tasks = await Task.find({ projectId })
            .populate("assignee", "-password")
            .populate("reporter", "-password")
            .populate("requirementId");

        return res.status(200).json({
            success: true,
            tasks,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}

export {
    createTask,
    getAllTasks,
}