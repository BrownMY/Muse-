'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersSparkQueues extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  usersSparkQueues.init({
    userId: DataTypes.INTEGER,
    sparkQueueId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usersSparkQueues',
  });
  return usersSparkQueues;
};