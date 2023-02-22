'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const cateQuestions = sequelize.define("category_questions");
      questions.belongsTo(cateQuestions,{  foreignKey: "category_question_id",})
    }
  }
  questions.init({
    title: DataTypes.STRING,
    created_by: DataTypes.STRING,
    content: DataTypes.STRING,
    category_question_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'questions',
  });
  return questions;
};