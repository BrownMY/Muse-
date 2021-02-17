'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class flare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.flare.belongsTo(models.user)
      models.flare.hasOne(models.photoupload)
    }
  };
  flare.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    sparkurl: DataTypes.STRING,
    color1: DataTypes.STRING,
    color2: DataTypes.STRING,
    color3: DataTypes.STRING,
    word: DataTypes.STRING,
    username: DataTypes.STRING,
    flaretitle: DataTypes.STRING,
    uploadurl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'flare',
  });
  return flare;
};