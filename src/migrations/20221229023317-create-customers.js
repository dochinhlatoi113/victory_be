'use strict';
const db = require("../models/index")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      sex:{
        type: Sequelize.INTEGER
      },
      sex2:{
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      dob2: {
        type: Sequelize.STRING
      },
      nameRelation: {
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
    await queryInterface.dropTable('customers');
  }
};