import { Model, Sequelize } from "sequelize";

import sequelize from "../libs/database.js";


class Employee extends Model {
    getFullname() {
        return [this.firstName, this.lastName].join(' ');
    }
}

Employee.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    fullName: {
        type: Sequelize.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
    email: {
        type: Sequelize.STRING
    },
    mobilePhone: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    placeOfBirth: {
        type: Sequelize.STRING
    },
    birthDate: {
        type: Sequelize.DATE
    },
    gender: {
        type: Sequelize.STRING
    },
    maritalStatus: {
        type: Sequelize.STRING
    },
    bloodType: {
        type: Sequelize.STRING
    },
    religion: {
        type: Sequelize.STRING
    },
    identityType: {
        type: Sequelize.STRING
    },
    identityNumber: {
        type: Sequelize.STRING
    },
    isPermanent: {
        type: Sequelize.BOOLEAN
    },
    identityExpireDate: {
        type: Sequelize.DATE
    },
    postalCode: {
        type: Sequelize.STRING
    },
    citizenIdAddress: {
        type: Sequelize.STRING
    },
    residentialAddress: {
        type: Sequelize.STRING
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
    modelName: "Employee"
})

export default Employee