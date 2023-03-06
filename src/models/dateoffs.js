'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dateOffs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dateOffs.init({
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    totalDate: DataTypes.INTEGER,
    date: DataTypes.INTEGER,
    status: DataTypes.STRING,
    reason:DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 'dateOffs',
  });
  return dateOffs;
};