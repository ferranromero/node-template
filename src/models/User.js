import { sequelize } from "../config/db";
import {Sequelize} from "sequelize";

const User = sequelize.define('user', {
    // attributes
    uuid:{
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    userName:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    token:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            isEmail: true,
        }
    }
  }, {
    // options
  });
export default User;
