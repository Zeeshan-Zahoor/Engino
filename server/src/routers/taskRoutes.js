import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';
import { 
    createTask,
    deleteTask,
    getAllTasks,
    getTask,
    updateTask,
} from '../controllers/taskController.js';

const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, workspaceMiddleware, getAllTasks);
router.get('/:taskId', authMiddleware, workspaceMiddleware, getTask);

router.post('/', authMiddleware, workspaceMiddleware, createTask);

router.patch('/:taskId', authMiddleware, workspaceMiddleware, updateTask);

router.delete('/:taskId', authMiddleware, workspaceMiddleware, deleteTask);

export default router;