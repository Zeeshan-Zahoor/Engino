import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import workspaceMiddleware from '../middleware/workspaceMiddleware.js';
import { 
    createTask,
    deleteTask,
    getAllTasks,
    getTask,
    updateTask,
    claimTask,
    unclaimTask,
} from '../controllers/taskController.js';

const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, workspaceMiddleware, getAllTasks);
router.get('/:taskId', authMiddleware, workspaceMiddleware, getTask);

router.post('/', authMiddleware, workspaceMiddleware, createTask);
router.post('/:taskId/claim', authMiddleware, workspaceMiddleware, claimTask);

router.patch('/:taskId', authMiddleware, workspaceMiddleware, updateTask);
router.patch('/:taskId/unclaim', authMiddleware, workspaceMiddleware, unclaimTask);

router.delete('/:taskId', authMiddleware, workspaceMiddleware, deleteTask);

export default router;