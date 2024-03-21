import { Model, DataTypes } from "sequelize";

import sequelize from "../libs/database.js";


class Drive extends Model { }

Drive.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  driveId: DataTypes.STRING,
  employeeId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'Drive',
});

export default Drive
