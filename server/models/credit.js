'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Credit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Credit.init(
    {
      credit: DataTypes.NUMBER,
      realmId: DataTypes.STRING,
      purchaseDate: DataTypes.DATE,
      linkToTicket: DataTypes.STRING,
      autoRenewal: DataTypes.STRING,
      notifyCheck: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: 'Credit',
    },
  );
  return Credit;
};
