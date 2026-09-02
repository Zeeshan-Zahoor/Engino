import express from 'express';
import { 
    addProjectMember,
    createProject,
    deleteProject,
    getAllProjects,
    getProject,
    getProjectMembers,
    removeProjectMember,
    updateProject,
 } from '../controllers/projectController.js';

 import authMiddleware from '../middleware/authMiddleware.js';
 import workspaceMiddleware from '../middleware/workspaceMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, workspaceMiddleware, getAllProjects);
router.get('/:projectId', authMiddleware, workspaceMiddleware, getProject);
router.get('/:projectId/members', authMiddleware, workspaceMiddleware, getProjectMembers);

router.post('/', authMiddleware, workspaceMiddleware, createProject);
router.post('/:projectId/members', authMiddleware, workspaceMiddleware, addProjectMember);

router.delete('/:projectId/members/:userId', authMiddleware, workspaceMiddleware, removeProjectMember);
router.delete('/:projectId', authMiddleware, workspaceMiddleware, deleteProject);

router.put('/:projectId', authMiddleware, workspaceMiddleware, updateProject);

export default router;