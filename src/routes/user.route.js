import { Router } from 'express';
import {
    addUser,
    editUser,
    getUser,
    getUserProjects,
    listUsers,
    login,
    removeUser
} from '../controllers/user.controller.js';
import { isAdmin, verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/', verifyToken, isAdmin, addUser);
router.get('/', verifyToken, isAdmin, listUsers);
router.get('/:id', getUser);
router.get(
    '/:id/projects',
    verifyToken,
    getUserProjects
);

router.patch('/:id', verifyToken, isAdmin, editUser);
router.delete('/:id', verifyToken, isAdmin, removeUser);

export default router;
