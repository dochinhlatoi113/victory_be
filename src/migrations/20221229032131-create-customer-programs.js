'use strict';
/** @type {import('sequelize-cli').Migration} */
const customers = require("../models/customers")
const programs = require("../models/programs")
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_programs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "customers", // 'Movies' would also work
          key: 'id'
        }
      },
      programId: {
        type: Sequelize.INTEGER,
        references: {
          model: "programs", // 'Movies' would also work
          key: 'id'
        }
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
    await queryInterface.dropTable('customer_programs');
  }
};