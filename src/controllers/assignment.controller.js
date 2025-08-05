import { error, success } from '../helpers/response.js';
import models from '../models/index.js';
import * as asgSvc from '../services/assignment.service.js';

export async function assignUser(req, res) {
    try {
        const { userId, projectId } = req.body;

        if (!userId || !projectId) {
            return error(res, 400, "Missing required fields: userId, projectId");
        }

        const existing = await asgSvc.findAssignment(userId, projectId);
        if (existing) {
            return error(
                res,
                409,
                `User ${userId} is already assigned to project ${projectId}`
            );
        }


        const asg = await asgSvc.assignUserToProject({ userId, projectId });
        return success(res, 201, "User assigned to project", asg);

    } catch (err) {
        console.log('err :>> ', err);
        const msg = err.message || "";

        if (msg.includes("not found")) {
            return error(res, 404, "Assignment failed", msg);
        }

        return error(res, 400, "Assignment failed", msg);
    }
}
export async function listAssignments(req, res) {
    try {
        const list = await asgSvc.getAllAssignments();
        return success(res, 200, 'Assignments fetched', list);
    } catch (err) {
        return error(res, 500, 'Fetch assignments failed', err.message);
    }
}

export async function removeAssignment(req, res) {
    try {
        const assignmentId = req.params.id;

        const assignment = await models.Assignment.findByPk(assignmentId);
        if (!assignment) {
            return error(res, 404, `Assignment with id ${assignmentId} not found`);
        }

        await assignment.destroy();
        return success(res, 200, 'Assignment removed');

    } catch (err) {
        return error(res, 400, 'Remove assignment failed', err.message);
    }
}

