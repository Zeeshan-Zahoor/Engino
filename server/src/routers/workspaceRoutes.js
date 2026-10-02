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
    getAllRequirements,
    extractRequirementData,
    exploreWithAIWorkspace,
    getInsights,
} from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getWorkspaces);
router.get('/:workspaceId', authMiddleware, workspaceMiddleware, getWorkspace);
router.get('/:workspaceId/team', authMiddleware, workspaceMiddleware, getWorkspaceMembers);
router.get('/:workspaceId/aiPlans', authMiddleware, workspaceMiddleware, getAllAIPlans);
router.get('/:workspaceId/allTasks', authMiddleware, workspaceMiddleware, getAllTasks);
router.get('/:workspaceId/insights', authMiddleware, workspaceMiddleware, getInsights);
router.get('/:workspaceId/requirements', authMiddleware, workspaceMiddleware, getAllRequirements);
router.get('/invitations/:token', getInvitation);

router.post('/:workspaceId/invite', authMiddleware, workspaceMiddleware, sendInvitation);
router.post('/:workspaceId/ai/extract-requirement', authMiddleware, workspaceMiddleware, extractRequirementData);
router.post('/:workspaceId/ai/explore', authMiddleware, workspaceMiddleware, exploreWithAIWorkspace);

router.post('/accept-invite', acceptInvitation);
router.post('/decline-invite', declineInvitation);

export default router;