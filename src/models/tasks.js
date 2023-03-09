'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const taskAdmin = sequelize.define('task_admins');
      tasks.hasMany(taskAdmin,{  foreignKey: "taskId",})

    }
  }
  tasks.init({
    title: DataTypes.STRING,
    status: DataTypes.STRING,
    content: DataTypes.TEXT('long'),
    fromDate: DataTypes.STRING,
    toDate: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'tasks',
  });
  return tasks;
};

