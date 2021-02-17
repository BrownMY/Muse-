'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class photoupload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     models.photoupload.belongsTo(models.flare)
    
     
    }
  };
  photoupload.init({                                                      
    username: DataTypes.STRING,
    uploadurl: DataTypes.STRING,
    flaretitle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'photoupload',
  });
  return photoupload;
};