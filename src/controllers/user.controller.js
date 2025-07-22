import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { error, success } from '../helpers/response.js';
import models from '../models/index.js';
import * as userSvc from '../services/user.service.js';



export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await models.User.findOne({ where: { email }, include: 'role' });
        if (!user) {
            return error(res, 404, 'User not found');
        }
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return error(res, 401, 'Invalid Password');
        }
        const token = jwt.sign({ id: user.id }, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn
        });
        return success(res, 200, 'Login successful', {
            id: user.id,
            email: user.email,
            role: user.role.name,
            accessToken: token
        });
    } catch (err) {
        return error(res, 500, 'Login failed', err.message);
    }
}

export async function addUser(req, res) {
    try {
        const { email, password, firstName, lastName, roleId } = req.body;


        if (!email || !password || !firstName || !roleId) {
            return error(res, 400, 'Missing required fields (email, password, firstName, roleId)');
        }

        const existing = await userSvc.getUserByEmail(email.toLowerCase());
        if (existing) {
            return error(res, 409, `A user with email "${email}" already exists`);
        }

        const user = await userSvc.createUser({ email: email.toLowerCase(), password, firstName, lastName, roleId });
        return success(res, 201, 'User created', user);

    } catch (err) {
        return error(res, 400, 'Create user failed', err.message);
    }
}

export async function listUsers(req, res) {
    try {
        // 1) fetch all users
        const allUsers = await userSvc.getAllUsers();

        // 2) exclude the current user
        const filtered = allUsers.filter(u => u.id !== req.userId);

        return success(res, 200, 'Users fetched', filtered);
    } catch (err) {
        return error(res, 500, 'Fetch users failed', err.message);
    }
}

export async function getUser(req, res) {
    try {
        const user = await userSvc.getUserById(req.params.id);
        if (!user) return error(res, 404, 'User not found');
        return success(res, 200, 'User fetched', user);
    } catch (err) {
        return error(res, 500, 'Fetch user failed', err.message);
    }
}

export async function editUser(req, res) {
    try {
        const userId = req.params.id;
        const updates = req.body;


        const existingUser = await userSvc.getUserById(userId);
        if (!existingUser) {
            return error(res, 404, `User with id ${userId} not found`);
        }


        if (updates.email) {
            const other = await userSvc.getUserByEmail(updates.email);
            if (other && other.id.toString() !== userId.toString()) {
                return error(res, 409, `Email "${updates.email}" is already in use`);
            }
        }

        // 3) (Optional) Validate required fields here if needed
        // e.g. if (!updates.firstName) return error(res, 400, 'firstName is required');

        const user = await userSvc.updateUser(userId, updates);
        return success(res, 200, 'User updated', user);

    } catch (err) {
        return error(res, 400, 'Update user failed', err.message);
    }
}

export async function removeUser(req, res) {
    try {
        const userId = req.params.id;

        // 1) Verify the user exists
        const existingUser = await userSvc.getUserById(userId);
        if (!existingUser) {
            return error(res, 404, `User with id ${userId} not found`);
        }

        // 2) Perform deletion
        await userSvc.deleteUser(userId);
        return success(res, 200, 'User deleted');

    } catch (err) {
        // 3) Catch any DB or unexpected errors
        return error(res, 400, 'Delete user failed', err.message);
    }
}
export async function getUserProjects(req, res) {
    try {
        const userId = req.params.id;
        const projects = await userSvc.getProjectsByUserId(userId);
        return success(res, 200, 'Projects fetched', projects);
    } catch (err) {
        if (err.message.includes('not found')) {
            return error(res, 404, err.message);
        }
        return error(res, 500, 'Fetch user projects failed', err.message);
    }
}