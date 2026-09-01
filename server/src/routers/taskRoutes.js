import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
    createTask
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/:projectId/create', authMiddleware, createTask);

export default router;