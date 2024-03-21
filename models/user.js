
import { Model, Sequelize } from "sequelize";
import sequelize from "../libs/database.js";

class User extends Model { }

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notNull: true
    }
  },
  password: {
    type: Sequelize.STRING
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }

}, {
  sequelize,
  modelName: "User"
})

export default User