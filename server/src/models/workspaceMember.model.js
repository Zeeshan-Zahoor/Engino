import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema(
    {
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: ["Admin", "Member"],
            default: "Member",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "active", "inactive"],
            default: "pending",
            required: true,
        },

        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        joinedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

workspaceMemberSchema.index(
    { workspaceId: 1, userId: 1 },
    { unique: true }
);

const WorkspaceMember = mongoose.model(
    "WorkspaceMember",
    workspaceMemberSchema
);

export default WorkspaceMember;