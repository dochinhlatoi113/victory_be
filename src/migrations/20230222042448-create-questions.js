'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      category_question_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
        references: {
          model: "category_questions",
          key: 'id',
          as:'category_questions_id'
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
    await queryInterface.dropTable('questions');
  }
};