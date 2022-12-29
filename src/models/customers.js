'use strict';
const childrens = require("../models/childrens") 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const childrens = sequelize.define('childrens');
      customers.hasMany(childrens,{ foreignKey:"customerId" , onDelete: "CASCADE"});
    }
  }
  customers.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    sex: DataTypes.INTEGER,
    sex2: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    dob: DataTypes.STRING,
    dob2: DataTypes.STRING,
    nameRelation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customers',
  });
  return customers;
};