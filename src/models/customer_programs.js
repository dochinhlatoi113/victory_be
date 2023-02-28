'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class customer_programs extends Model {
    static associate(models) {
      const { customers, programs } = models;
      customers.belongsToMany(programs, {
        through: customer_programs,
        onDelete: 'cascade',
        onUpdate: 'CASCADE',
        foreignKey: 'customerId'
      });
      programs.belongsToMany(customers, {
        through: customer_programs,
        onDelete: 'cascade',
        onUpdate: 'CASCADE',
        foreignKey: 'programId'
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
