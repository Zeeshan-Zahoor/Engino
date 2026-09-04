import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';

import { 
    aiAnalysis,
    answerClarification,
    generatePlan,
} from '../controllers/aiController.js';

const router = express.Router({ mergeParams: true });

router.post('/analyze', authMiddleware, workspaceMiddleware, aiAnalysis);
router.post('/clarify', authMiddleware, workspaceMiddleware, answerClarification);
router.post('/plan', authMiddleware, workspaceMiddleware, generatePlan);

export default router;