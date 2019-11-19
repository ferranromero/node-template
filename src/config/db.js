import 'dotenv/config';
import Logger from '../utils/Logger';

const Sequelize = require('sequelize');

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    logging: false,
    host: 'localhost',
    dialect: 'postgres',
  },
);

export const connectDB = () => {
  sequelize
    .authenticate()
    .then(() => {
      Logger.log('Connection OK');
    })
    .catch(err => {
      Logger.warn('Error: ', err);
    });
};
export const syncDatabase = force => {
  sequelize
    .sync({
      force,
    })
    .then(() => {
      Logger.log('Database models sync!');
    })
    .catch(err => {
      Logger.warn('Error sync database models', err);
    });
};
