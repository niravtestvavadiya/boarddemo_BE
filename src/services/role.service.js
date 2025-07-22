import models from '../models/index.js';

export async function createRole(payload) {
    return await models.Role.create(payload);
}

export async function getAllRoles() {
    return await models.Role.findAll();
}

export async function getRoleById(id) {
    return await models.Role.findByPk(id);
}
export async function getRoleByName(roleName) {
    return await models.Role.findOne({
        where: { name: roleName }
    });
}

export async function updateRole(id, payload) {
    const role = await getRoleById(id);
    if (!role) throw new Error('Role not found');
    return await role.update(payload);
}

export async function deleteRole(id) {
    const role = await getRoleById(id);
    if (!role) throw new Error('Role not found');
    await role.destroy();
    return;
}
