import { DataTypes, Model } from 'sequelize';

export default class Assignment extends Model {
    static initialize(sequelize) {
        Assignment.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            projectId: { type: DataTypes.INTEGER, allowNull: false }
        }, {
            sequelize,
            modelName: 'Assignment',
            tableName: 'assignments',
            timestamps: true,
        });
    }

    static associate({ User, Project }) {
        this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
        this.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
    }
}
