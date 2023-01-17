'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer_accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customer_accounts.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    created_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customer_accounts',
  });
  return customer_accounts;
};