import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        goals: {
            type: [String],
            default: [],
        },
        technologies: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["Planning", "In Progress", "On Hold", "Completed"],
            default: "Planning",
        },
        startDate: {
            type: Date,
            required: true,
        },
        targetDate: {
            type: Date,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;