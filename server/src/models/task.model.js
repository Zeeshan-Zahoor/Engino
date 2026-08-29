import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        requirementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Requirement",
            default: null,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            required: true,
            default: "Todo",
        },

        priority: {
            type: String,
            required: true,
            default: "Medium",
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        estimatedEffortMinutes: {
            type: Number,
            default: 0,
            min: 0,
        },

        timeSpentMinutes: {
            type: Number,
            default: 0,
            min: 0,
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        type: {
            type: String,
            required: true,
        },

        complexity: {
            type: String,
            required: true,
        },

        tags: {
            type: [String],
            default: [],
        },
    }, 
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;