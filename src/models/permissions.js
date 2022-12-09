'use strict';
const db = require("../models/index")
const {
  Model
} = require('sequelize');
const user_permission = require("./user_permission");
module.exports = (sequelize, DataTypes) => {
  class permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const user_permission = sequelize.define('user_permission');
      permissions.hasMany(user_permission)
    }
  }
  permissions.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'permissions',
  });
  return permissions;
};