'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      total: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      spent: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      balance: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2),
        validate: {
          isDecimal: true,
          min: 0
        }
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
    await queryInterface.dropTable('Wallets');
  }
};