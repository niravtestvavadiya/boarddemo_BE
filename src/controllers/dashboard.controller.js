import { error, success } from '../helpers/response.js';
import models from '../models/index.js';
import * as dashSvc from '../services/dashboard.service.js';
import * as userSvc from '../services/user.service.js';

export async function getDashboard(req, res) {
    try {
        // load the user + role
        const user = await models.User.findByPk(req.userId, { include: 'role' });
        if (!user) return error(res, 404, 'User not found');

        if (user.role.name === 'admin') {
            // Admin: total counts
            const [userCount, projectCount] = await Promise.all([
                dashSvc.countUsers(),
                dashSvc.countProjects()
            ]);
            return success(res, 200, 'Dashboard data fetched', {
                totalUsers: userCount,
                totalProjects: projectCount
            });
        } else {
            // Regular user: list *their* projects
            const projects = await userSvc.getProjectsByUserId(req.userId);
            return success(res, 200, 'Dashboard data fetched', {
                totalProjects: projects.length
            });
        }
    } catch (err) {
        return error(res, 500, 'Fetch dashboard data failed', err.message);
    }
}