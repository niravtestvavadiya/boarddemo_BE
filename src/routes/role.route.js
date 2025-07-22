import { Router } from 'express';
import {
    addRole,
    editRole,
    getRole,
    listRoles,
    removeRole
} from '../controllers/role.controller.js';
import { isAdmin, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verifyToken, isAdmin, addRole);
router.get('/', verifyToken, isAdmin, listRoles);
router.get('/:id', verifyToken, isAdmin, getRole);
router.patch('/:id', verifyToken, isAdmin, editRole);
router.delete('/:id', verifyToken, isAdmin, removeRole);

export default router;

