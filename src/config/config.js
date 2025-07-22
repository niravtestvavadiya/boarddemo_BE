
import dotenv from 'dotenv';
dotenv.config()

export default {
     database: {
          database: process.env.DB_DATABASE || 'dashboard',
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || '',
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          dialect: process.env.DB_DIALECT || 'postgres',
     },
     port: process.env.PORT || 3000,
     project_path: process.env.APP_PROJECT_PATH || 'http://localhost:3000',
     jwtSecret: process.env.JWT_SECRET || 'CHANGE_THIS_SECRET',
     jwtExpiresIn: '1h',
     saltRounds: 10,
     bcrypt_salt: process.env.BCRYPT_SALT || 10,
};
