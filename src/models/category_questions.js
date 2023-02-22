'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category_questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const questions = sequelize.define("questions");
      category_questions.hasMany(questions,{  foreignKey: "category_question_id",})
    }
  }
  category_questions.init({
    category_name: DataTypes.STRING,
    created_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'category_questions',
  });
  return category_questions;
};