import WorkspaceMember from "../models/workspaceMember.model.js";


const workspaceMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { workspaceId } = req.params;

        if (!workspaceId) {
            return res.status(400).json({
                success: false,
                message: "Workspace ID is required",
            });
        }

        const membership = await WorkspaceMember.findOne( {
            userId,
            workspaceId,
            status: "active",
        });

        if (!membership) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this workspace",
            });
        }

        req.workspaceId = workspaceId;
        req.membership = membership;

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
}

export default workspaceMiddleware;