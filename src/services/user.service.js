import bcrypt from 'bcrypt';
import config from '../config/config.js';
import models from '../models/index.js';

export async function createUser(payload) {
    const hashed = await bcrypt.hash(payload.password, config.saltRounds);

    return await models.User.create({
        ...payload,
        password: hashed,
    });
}

export async function getAllUsers() {
    return await models.User.findAll({ include: 'role' });
}

export async function getUserById(id) {
    return await models.User.findByPk(id, { include: 'role' });
}

export async function getUserByEmail(email) {
    return await models.User.findOne({ where: { email } });
}

export async function updateUser(id, payload) {
    const user = await getUserById(id);
    if (!user) throw new Error('User not found');
    return await user.update(payload);
}

export async function deleteUser(id) {
    const user = await getUserById(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return;
}

export async function getProjectsByUserId(userId) {
    const user = await models.User.findByPk(userId, {
        include: {
            model: models.Project,
            as: 'projects',
            through: { attributes: [] }
        }
    });
    if (!user) throw new Error(`User with id ${userId} not found`);
    return user.projects;
}