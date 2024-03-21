import User from "./user.js";
import Employee from "./employee.js";
import Drive from "./drive.js";

Employee.hasOne(Drive, {
    foreignKey: "employeeId"
});
Drive.belongsTo(Employee);

export { Employee, Drive, User }