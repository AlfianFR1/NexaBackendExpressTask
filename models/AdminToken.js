'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminToken.init({
    token: { type: DataTypes.TEXT, allowNull: false }
  }, {
    sequelize,
    modelName: 'AdminToken',
  });
  return AdminToken;
};