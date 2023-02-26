'use strict';
const customers = require("../models/index")
const {
  Model
} = require('sequelize');
const db = require(".");
module.exports = (sequelize, DataTypes) => {
  class customer_programs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const customers = sequelize.define('customers');
      const programs = sequelize.define('programs');
      customers.belongsToMany(programs, {
        through: customer_programs, onDelete: 'cascade', onUpdate: 'CASCADE',
      });
      programs.belongsToMany(customers, {
        through: customer_programs, onDelete: 'cascade', onUpdate: 'CASCADE',
      });
    }
  }
  customer_programs.init({
    customerId: DataTypes.INTEGER,
    programId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'customer_programs',
  });
  return customer_programs;
};