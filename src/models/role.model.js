import { DataTypes, Model } from 'sequelize';

export default class Role extends Model {
    static initialize(sequelize) {
        Role.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false, unique: true },
        }, {
            sequelize,
            modelName: 'Role',
            tableName: 'roles',
            timestamps: true,
            paranoid: true
        });
    }

    static associate({ User }) {
        this.hasMany(User, { foreignKey: 'roleId', as: 'users' });
    }
}
