import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        workspaceId: {
            type: mongoose.Schema.ObjectId,
            ref: "Workspace",
            required: true,
        },
        invitedBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["Admin", "Member"],
            default: "Member",
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Declined"],
            default: "Pending",
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    }, 
    {
        timestamps: true,
    }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;