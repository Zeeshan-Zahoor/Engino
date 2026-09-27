import express from 'express';
import { 
    acceptInvitation,
    declineInvitation,
    getWorkspace,
    getWorkspaceMembers,
    getWorkspaces,
    getInvitation,
    getAllAIPlans,
    getAllTasks,
    sendInvitation,
 } from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getWorkspaces);
router.get('/:workspaceId', authMiddleware, workspaceMiddleware, getWorkspace);
router.get('/:workspaceId/team', authMiddleware, workspaceMiddleware, getWorkspaceMembers);
router.get('/:workspaceId/aiPlans', authMiddleware, workspaceMiddleware, getAllAIPlans);
router.get('/:workspaceId/allTasks', authMiddleware, workspaceMiddleware, getAllTasks);
router.get('/invitations/:token', getInvitation);

router.post('/:workspaceId/invite', authMiddleware, workspaceMiddleware, sendInvitation);

router.post('/accept-invite', acceptInvitation);
router.post('/decline-invite', declineInvitation);

export default router;