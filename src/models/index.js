import { sequelize } from '../config/db.config.js';
import Assignment from './assignment.model.js';
import Project from './project.model.js';
import Role from './role.model.js';
import User from './user.model.js';

const models = { Role, User, Project, Assignment };

// Initialize & associate
Object.values(models).forEach(model => {
    model.initialize(sequelize);
});

Role.associate(models);
User.associate(models);
Project.associate(models);
Assignment.associate(models);

export default models;
