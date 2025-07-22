import { DataTypes, Model } from 'sequelize';

export default class Project extends Model {
    static initialize(sequelize) {
        Project.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: false },
            dueDate: { type: DataTypes.DATE, allowNull: true }
        }, {
            sequelize,
            modelName: 'Project',
            tableName: 'projects',
            timestamps: true,
            paranoid: true
        });
    }

    static associate({ User, Assignment }) {
        this.belongsToMany(User, { through: Assignment, foreignKey: 'projectId', as: 'users' });
    }
}
