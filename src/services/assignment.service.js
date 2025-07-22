import models from '../models/index.js';
import * as projectSvc from './project.service.js';
import * as userSvc from './user.service.js';

export async function getAllAssignments() {
    return await models.Assignment.findAll({
        include: ['user', 'project']
    });
}

export async function removeAssignment(id) {
    const asg = await models.Assignment.findByPk(id);
    if (!asg) throw new Error('Assignment not found');
    await asg.destroy();
    return;
}

export async function findAssignment(userId, projectId) {
    return await models.Assignment.findOne({
        where: { userId, projectId }
    });
}

export async function assignUserToProject({ userId, projectId }) {
    // we’ll still keep the existing checks/catch‑all here
    const user = await userSvc.getUserById(userId);
    if (!user) throw new Error(`User with id ${userId} not found`);

    const project = await projectSvc.getProjectById(projectId);
    if (!project) throw new Error(`Project with id ${projectId} not found`);

    const existing = await findAssignment(userId, projectId);
    if (existing) throw new Error(`User ${userId} is already assigned to project ${projectId}`);

    return await models.Assignment.create({ userId, projectId });
}