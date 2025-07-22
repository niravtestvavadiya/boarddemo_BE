import { Router } from 'express';
import {
    assignUser,
    listAssignments,
    removeAssignment
} from '../controllers/assignment.controller.js';
import { isAdmin, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verifyToken, isAdmin, assignUser);
router.get('/', verifyToken, isAdmin, listAssignments);
router.delete('/:id', verifyToken, isAdmin, removeAssignment);

export default router;
