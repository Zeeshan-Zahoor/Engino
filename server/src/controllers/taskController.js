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

        if (requirementId !== "") {
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
            task: newTask,
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

const getTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const workspaceId = req.workspaceId;

        if(!projectId || !taskId) {
            return res.status(404).json({
                success: false,
                message: "Project ID and task ID are required!",
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        })

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found in the workspace",
            });
        }

        const task = await Task.findOne({
                _id: taskId,
                projectId,
            })
            .populate("requirementId")
            .populate("assignee", "-password")
            .populate("reporter", "-password")
            .populate("projectId");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}

const updateTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const userId = req.user.userId;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        if (!projectId || !taskId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and task ID are required!",
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

        const task = await Task.findOne({
            _id: taskId,
            projectId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found in the project",
            });
        }

        let allowedFields = [];
        const updateFields = {};
        if (membership.role === "Admin") {
            allowedFields = [
                "title",
                "description",
                "status",
                "priority",
                "assignee",
                "dueDate",
                "estimatedEffortMinutes",
                "type",
                "complexity",
                "tags",
            ];

        } else {
            allowedFields = ["status"];
        }

        if ( membership.role !== "Admin" &&
            (!task.assignee || task.assignee.toString() !== userId.toString())) {
            return res.status(403).json({
                success: false,
                message: "You can only update tasks assigned to you",
            });
        }
            
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

         // If assignee is being changed, verify new assignee is a member of the project.
        if (updateFields.assignee !== undefined && updateFields.assignee !== null) {
            const projectMember = await ProjectMember.findOne({
                projectId,
                userId: updateFields.assignee,
            });

            if (!projectMember) {
                return res.status(400).json({
                    success: false,
                    message: "Assignee is not a project member",
                });
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Task updated successfully!",
            updatedTask,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const workspaceId = req.workspaceId;
        const membership = req.membership;

        if (!projectId || !taskId) {
            return res.status(400).json({
                success: false,
                message: "Project ID and task ID are required!",
            });
        }

        if (membership.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Only workspace admins can delete tasks",
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

        const task = await Task.findOne({
            _id: taskId,
            projectId,
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found in the project",
            });
        }

        await Task.findByIdAndDelete(taskId);

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully!",
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
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
}