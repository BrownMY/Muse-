'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sparkqueue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.sparkqueue.belongsToMany(models.user, {through: 'usersSparkQueues'})
    }
  };
  sparkqueue.init({
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    url: DataTypes.STRING,
    color1: DataTypes.STRING,
    color2: DataTypes.STRING,
    color3: DataTypes.STRING,
    flaretitle: DataTypes.STRING,
    uploadurl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sparkqueue',
  });
  return sparkqueue;
};