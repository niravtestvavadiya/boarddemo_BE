import models from '../models/index.js';

export async function createProject(payload) {
    return await models.Project.create(payload);
}

export async function getAllProjects() {
    return await models.Project.findAll({ include: 'users' });
}

export async function getProjectById(id) {
    return await models.Project.findByPk(id, { include: 'users' });
}

export async function getProjectByTitle(title) {
    return await models.Project.findOne({ where: { title } });
}

export async function updateProject(id, payload) {
    const project = await getProjectById(id);
    if (!project) throw new Error('Project not found');
    return await project.update(payload);
}

export async function deleteProject(id) {
    const project = await getProjectById(id);
    if (!project) throw new Error('Project not found');
    await project.destroy();
    return;
}
