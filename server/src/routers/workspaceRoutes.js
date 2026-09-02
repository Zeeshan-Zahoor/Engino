import express from 'express';
import { 
    acceptInvitation,
    declineInvitation,
    getWorkspace,
    getWorkspaceMembers,
    sendInvitation,
 } from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';

const router = express.Router();

router.get('/:workspaceId', authMiddleware, workspaceMiddleware, getWorkspace);
router.get('/:workspaceId/team', authMiddleware, workspaceMiddleware, getWorkspaceMembers);

router.post('/:workspaceId/invite', authMiddleware, workspaceMiddleware, sendInvitation);
router.post('/accept-invite', acceptInvitation);
router.post('/decline-invite', declineInvitation);

export default router;