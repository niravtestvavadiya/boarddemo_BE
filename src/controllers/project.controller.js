import { error, success } from '../helpers/response.js';
import models from '../models/index.js';
import * as projectSvc from '../services/project.service.js';
import * as userSvc from '../services/user.service.js';

export async function addProject(req, res) {
    try {
        const { title, dueDate, description, techStack, timeline } = req.body;

        if (!title || !description) {
            return error(res, 400, 'Missing required field: title | description');
        }

        const existing = await projectSvc.getProjectByTitle(title);
        if (existing) {
            return error(res, 409, `Project with title "${title}" already exists`);
        }

        const project = await projectSvc.createProject({
            title, dueDate, description,
            techStack: techStack ?? [],
            timeline: timeline ?? []
        });
        return success(res, 201, 'Project created', project);

    } catch (err) {
        console.log('err :>> ', err);
        return error(res, 400, 'Create project failed', err.message);
    }
}

export async function getProject(req, res) {
    try {
        const project = await projectSvc.getProjectById(req.params.id);
        if (!project) return error(res, 404, 'Project not found');
        return success(res, 200, 'Project fetched', project);
    } catch (err) {
        return error(res, 500, 'Fetch project failed', err.message);
    }
}

export async function editProject(req, res) {
    try {
        const projectId = req.params.id;
        const updates = req.body;

        const existingProject = await projectSvc.getProjectById(projectId);
        if (!existingProject) {
            return error(res, 404, `Project with id ${projectId} not found`);
        }

        if (updates.title) {
            const other = await projectSvc.getProjectByTitle(updates.title);
            if (other && other.id.toString() !== projectId.toString()) {
                return error(res, 409, `Another project with title "${updates.title}" already exists`);
            }
        }

        // const project = await projectSvc.updateProject(projectId, updates);
        const project = await projectSvc.updateProject(projectId, {
            ...updates,
            techStack: updates.techStack ?? [],
            timeline: updates.timeline ?? []
        });
        return success(res, 200, 'Project updated', project);

    } catch (err) {
        return error(res, 400, 'Update project failed', err.message);
    }
}

export async function removeProject(req, res) {
    try {
        const projectId = req.params.id;

        // 1) Verify it exists first
        const existing = await projectSvc.getProjectById(projectId);
        if (!existing) {
            return error(res, 404, `Project with id ${projectId} not found`);
        }

        // 2) Perform deletion
        await projectSvc.deleteProject(projectId);
        return success(res, 200, 'Project deleted');

    } catch (err) {
        // 3) Handle any DB or other errors
        return error(res, 400, 'Delete project failed', err.message);
    }
}

export async function listProjects(req, res) {
    try {
        // load user + role
        const user = await models.User.findByPk(req.userId, { include: 'role' });
        if (!user) return error(res, 404, 'User not found');

        let projects;
        if (user.role.name === 'admin') {
            // Admin sees all
            projects = await projectSvc.getAllProjects();
        } else {
            // Regular user only their assignments
            projects = await userSvc.getProjectsByUserId(req.userId);
        }

        return success(res, 200, 'Projects fetched', projects);
    } catch (err) {
        return error(res, 500, 'Fetch projects failed', err.message);
    }
}