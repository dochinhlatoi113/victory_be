'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.BIGINT
      },
      permissionId:{
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
        references: {
          model: 'permissions',
          key: 'id'
        }
      },
      departmentId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
        references: {
          model: 'departments',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_permissions');
  }
};