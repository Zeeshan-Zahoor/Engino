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
            enum: ["Todo", "In Progress", "Done"],
            default: "Todo",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
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

        type: {
            type: String,
            required: true,
        },

        complexity: {
            type: String,
            enum: ["Low", "Medium", "High"],
            required: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        generator: {
            type: String,
            enum: ["assistant", "user"],
            default: "user",
            required: true,
        }
    }, 
    {
        timestamps: true,
    }
);

taskSchema.index({ projectId: 1 });
taskSchema.index({ assignee: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;