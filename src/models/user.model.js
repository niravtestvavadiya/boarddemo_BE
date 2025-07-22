import { DataTypes, Model } from 'sequelize';

export default class User extends Model {
    static initialize(sequelize) {
        User.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: true },
            email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
            password: { type: DataTypes.STRING, allowNull: false },
            roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' } }
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            paranoid: true
        });
    }

    static associate({ Role, Assignment, Project }) {
        this.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
        this.belongsToMany(Project, { through: Assignment, foreignKey: 'userId', as: 'projects' });
    }
}
