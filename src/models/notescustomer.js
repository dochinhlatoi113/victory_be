'use strict';
const customers = require("./customers")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notesCustomers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
  
    }
  }
  notesCustomers.init({
    customerId: DataTypes.INTEGER,
    content: DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 'notesCustomers',
  });
  return notesCustomers;
};