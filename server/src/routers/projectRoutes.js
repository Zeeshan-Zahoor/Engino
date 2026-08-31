import express from 'express';
import { 
    createProject,
 } from '../controllers/projectController.js';

const router = express.Router();

router.post('/create', createProject);

export default router;