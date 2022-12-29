'use strict';
const customers= require("../models/customers")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class childrens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const customers = sequelize.define('customers');
      childrens.belongsTo(customers,{ foreignKey: {name:"customerId" , allowNull: false}, onDelete: "CASCADE" });
      customers.hasMany(childrens,{foreignKey: {name:"customerId" , allowNull: false}, onDelete: "CASCADE" })
    }
  }
  childrens.init({
    customerId: DataTypes.BIGINT,
    name: DataTypes.STRING,
    dob: DataTypes.STRING,
    sex: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'childrens',
  });
  return childrens;
};