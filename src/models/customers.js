'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customers.init({
    programs: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    sex: DataTypes.STRING,
    phone: DataTypes.STRING,
    dob: DataTypes.STRING,
    nameRelation: DataTypes.STRING,
    children: DataTypes.STRING,
    date: DataTypes.STRING,
    childrenSex: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customers',
  });
  return Customers;
};