import models from '../models/index.js';

export async function countUsers() {
    return await models.User.count();
}

export async function countProjects() {
    return await models.Project.count();
}
