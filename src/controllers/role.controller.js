import { error, success } from '../helpers/response.js';
import * as roleSvc from '../services/role.service.js';

export async function addRole(req, res) {
    try {

        const { name } = req.body;


        const existing = await roleSvc.getRoleByName(name);
        if (existing) {
            return error(res, 409, `Role "${name}" already exists`);
        }


        const role = await roleSvc.createRole({ name });
        return success(res, 201, 'Role created', role);

    } catch (err) {
        return error(res, 400, 'Create role failed', err.message);
    }
}

export async function listRoles(req, res) {
    try {
        const roles = await roleSvc.getAllRoles();
        return success(res, 200, 'Roles fetched', roles);
    } catch (err) {
        return error(res, 500, 'Fetch roles failed', err.message);
    }
}

export async function getRole(req, res) {
    try {
        const role = await roleSvc.getRoleById(req.params.id);
        if (!role) return error(res, 404, 'Role not found');
        return success(res, 200, 'Role fetched', role);
    } catch (err) {
        return error(res, 500, 'Fetch role failed', err.message);
    }
}

export async function editRole(req, res) {
    try {
        const role = await roleSvc.updateRole(req.params.id, req.body);
        return success(res, 200, 'Role updated', role);
    } catch (err) {
        return error(res, 400, 'Update role failed', err.message);
    }
}

export async function removeRole(req, res) {
    try {
        await roleSvc.deleteRole(req.params.id);
        return success(res, 200, 'Role deleted');
    } catch (err) {
        return error(res, 400, 'Delete role failed', err.message);
    }
}
