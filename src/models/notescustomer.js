'use strict';
const customers = require("../models/customers")
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
      const customers = sequelize.define('customers');
      notesCustomers.hasOne(customers,{ foreignKey: {name:"customerId" , allowNull: false}, onDelete: "CASCADE" });
    }
  }
  notesCustomers.init({
    customerId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'notesCustomers',
  });
  return notesCustomers;
};