import express from 'express';
import { 
    acceptInvitation,
    declineInvitation,
    getCurrentWorkspace,
    getWorkspaceMembers,
    sendInvitation,
 } from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/current', authMiddleware, getCurrentWorkspace);
router.get('/team', authMiddleware, getWorkspaceMembers);

router.post('/invite', authMiddleware, sendInvitation);
router.post('/accept-invite', acceptInvitation);
router.post('/decline-invite', declineInvitation);

export default router;