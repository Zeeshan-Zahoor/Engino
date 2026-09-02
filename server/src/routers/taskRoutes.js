import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';
import { 
    createTask,
    getAllTasks
} from '../controllers/taskController.js';

const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, workspaceMiddleware, getAllTasks);

router.post('/', authMiddleware, workspaceMiddleware, createTask);

export default router;