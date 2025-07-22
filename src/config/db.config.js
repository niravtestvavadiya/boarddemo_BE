import { Sequelize } from 'sequelize';
import config from './config.js';

export const sequelize = new Sequelize(
     config.database.database,
     config.database.username,
     config.database.password,
     {
          host: config.database.host,
          port: config.database.port,
          dialect: config.database.dialect,
          pool: config.database.pool,
          logging: config.database.logging,
          dialectOptions: {
               ssl: {
                    require: true,
                    rejectUnauthorized: false
               }
          }
     }
);

export async function connectDB() {
     try {
          await sequelize.authenticate();
          console.log('Database connected');
          await sequelize.sync({ alter: true });
          console.log('Models synced');
     } catch (err) {
          console.error('DB connection error:', err);
          process.exit(1);
     }
}
