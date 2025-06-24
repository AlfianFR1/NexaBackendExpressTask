'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Karyawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Karyawan.init({
    nip: { type: DataTypes.STRING, unique: true },
    nama: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {
    sequelize,
    modelName: 'Karyawan',
  });
  return Karyawan;
};