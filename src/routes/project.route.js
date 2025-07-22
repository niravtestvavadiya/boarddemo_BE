import { Router } from 'express';
import {
    addProject,
    editProject,
    getProject,
    listProjects,
    removeProject
} from '../controllers/project.controller.js';
import { isAdmin, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verifyToken, isAdmin, addProject);
router.get('/', verifyToken, listProjects);
router.get('/:id', getProject);
router.patch('/:id', verifyToken, isAdmin, editProject);
router.delete('/:id', verifyToken, isAdmin, removeProject);

export default router;
