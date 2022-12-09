'use strict';
const db = require("../models/index")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const B = sequelize.define('Admin');
      user_permission.belongsTo(B, { foreignKey:"userId" });
    }
  }
  user_permission.init({
    userId: DataTypes.BIGINT,
    permissionId: DataTypes.BIGINT,
    departmentId: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'user_permission',
  });


  return user_permission;
};