'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task_admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // const tasks = sequelize.define('tasks');
      // tasks.hasMany(task_admins,{  foreignKey: "taskId",})
      const admin = sequelize.define('Admin');
      task_admins.belongsTo(admin, { foreignKey:"userId" })
      // const admins = sequelize.define('admins');
      // admins.hasMany(task_admins,{  foreignKey: "userId",})
    }
  }
  task_admins.init({
    userId: DataTypes.INTEGER,
    taskId: DataTypes.INTEGER,
    department: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'task_admins',
  });
  return task_admins;
};