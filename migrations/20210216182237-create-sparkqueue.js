'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sparkqueues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      artist: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      color1: {
        type: Sequelize.STRING
      },
      color2: {
        type: Sequelize.STRING
      },
      color3: {
        type: Sequelize.STRING
      },
      flaretitle: {
        type: Sequelize.STRING
      },
      uploadurl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sparkqueues');
  }
};