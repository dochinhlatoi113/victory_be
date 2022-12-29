'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  medias.init({
    model: DataTypes.STRING,
    modelId: DataTypes.BIGINT,
    mediaFiles: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'medias',
  });
  return medias;
};