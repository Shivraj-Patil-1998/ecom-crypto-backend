"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Adminwallets extends Model {}
  Adminwallets.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assetId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      privateKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publicKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mnemonics: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Adminwallets",
      tableName: "Adminwallets",
      deletedAt: "deletedAt",
      timestamps: true,
      paranoid: true,
    }
  );
  return Adminwallets;
};
