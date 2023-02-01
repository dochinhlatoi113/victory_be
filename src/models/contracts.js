'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contracts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const customers = sequelize.define("customers");
      contracts.belongsTo(customers,{  foreignKey: "customerId",})

      const sales = sequelize.define("Admin");
      contracts.belongsTo(sales,{  foreignKey: "salesId"})
    }
  }
  contracts.init({
    no: DataTypes.STRING,
    representative: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    salesId: DataTypes.INTEGER,
    serviceFee: DataTypes.STRING,
    paymentTimeLine: DataTypes.STRING,
    note: DataTypes.STRING,
    link: DataTypes.STRING,
    customerName: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contracts',
  });
  return contracts;
};