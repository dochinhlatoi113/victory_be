'use strict';
const db = require("../models/index")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const customer = sequelize.define("customers");
      contract.belongsTo(customer,{  foreignKey: "customerId",})
    }
  }
  contract.init({
    no: DataTypes.STRING,
    representative: DataTypes.STRING,
    client: DataTypes.STRING,
    serviceFee: DataTypes.STRING,
    paymentTimeLine: DataTypes.STRING,
    competiton: DataTypes.STRING,
    imageContract: DataTypes.TEXT('long'),
    receipts: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contract',
  });
  return contract;
};