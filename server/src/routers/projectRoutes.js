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

const router = express.Router();

router.get('/all', authMiddleware, getAllProjects);
router.get('/:projectId', authMiddleware, getProject);
router.get('/:projectId/members', authMiddleware, getProjectMembers);

router.post('/create', authMiddleware, createProject);
router.post('/add-member', authMiddleware, addProjectMember);
router.post('/remove-member', authMiddleware, removeProjectMember);

router.delete('/:projectId', authMiddleware, deleteProject);

router.put('/:projectId', authMiddleware, updateProject);

export default router;