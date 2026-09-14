import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Planned", "In Progress", "Completed"],
            default: "Planned",
        },

        aiStatus: {
            type: String,
            enum: [
                "Pending",
                "Clear",
                "Needs Clarification",
                "Plan Generated",
                "AI Plan Ready",
                "Approved",
            ],
            default: "Pending",
        },

        aiAnalysis: {
            summary: {
                type: String,
                default: "",
            },

            questions: {
                type: [String],
                default: [],
            },
        },

        complexity: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        estimatedEffortMinutes: {
            type: Number,
            default: 0,
            min: 0,
        },

        aiConfidence: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        acceptanceCriteria: {
            type: [String],
            default: [],
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

requirementSchema.index({ projectId: 1 });

const Requirement = mongoose.model("Requirement", requirementSchema);

export default Requirement;