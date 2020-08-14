'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Wallet.init({
    user_token: DataTypes.STRING,
    total: DataTypes.DECIMAL(10,2),
    spent: DataTypes.DECIMAL(10,2),
    balance: DataTypes.DECIMAL(10,2)
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};