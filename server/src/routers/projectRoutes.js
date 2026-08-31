import express from 'express';
import { 
    addProjectMember,
    createProject,
 } from '../controllers/projectController.js';

 import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createProject);
router.post('/add-member', authMiddleware, addProjectMember);

export default router;