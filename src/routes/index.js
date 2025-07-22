import { Router } from 'express';
import assignmentRoutes from './assignment.route.js';
import dashboardRoutes from './dashboard.route.js';
import projectRoutes from './project.route.js';
import roleRoutes from './role.route.js';
import userRoutes from './user.route.js';


const router = Router();


router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/dashboard', dashboardRoutes);
export default router;
