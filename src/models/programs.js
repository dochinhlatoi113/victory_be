'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class programs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  programs.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'programs',
  });
  return programs;
};