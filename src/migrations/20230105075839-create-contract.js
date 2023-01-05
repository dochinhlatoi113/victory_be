'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      no: {
        type: Sequelize.STRING
      },
      representative: {
        type: Sequelize.STRING
      },
      customerId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
        references: {
          model: 'customers',
          key: 'id'
        }
      },
      serviceFee: {
        type: Sequelize.STRING
      },
      paymentTimeLine: {
        type: Sequelize.STRING
      },
      competiton: {
        type: Sequelize.STRING
      },
      imageContract: {
        type: Sequelize.TEXT('long')
      },
      receipts: {
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
    await queryInterface.dropTable('contracts');
  }
};