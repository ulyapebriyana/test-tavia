'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Employees', {
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
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Employees');
  }
};
