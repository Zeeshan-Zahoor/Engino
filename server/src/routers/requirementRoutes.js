import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';

import {
    createRequirement,
    deleteRequirement,
    getAllRequirements,
    getRequirement,
    updateRequirement,
} from '../controllers/requirementController.js';


const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, workspaceMiddleware, getAllRequirements);
router.get('/:requirementId', authMiddleware, workspaceMiddleware, getRequirement);

router.post('/', authMiddleware, workspaceMiddleware, createRequirement);
router.post('/:requirementId', authMiddleware, workspaceMiddleware, updateRequirement);

router.delete('/:requirementId', authMiddleware, workspaceMiddleware, deleteRequirement);


export default router;