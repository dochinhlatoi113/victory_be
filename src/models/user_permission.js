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
      const Admin = sequelize.define('Admin');
      const permissions = sequelize.define('permissions');
      const departments = sequelize.define('departments');
    
      user_permission.belongsTo(Admin, { foreignKey:"userId" })
      user_permission.belongsTo(departments, { foreignKey:"departmentId" })
      user_permission.belongsTo(permissions, { foreignKey:"permissionId" })
      
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