"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class EtherWallets extends Model {
    static associate(models) {
      ///
    }
  }
  EtherWallets.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      privateKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      publicKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      balance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "EtherWallets",
      tableName: "EtherWallets",
      deletedAt: "deletedAt",
      timestamps: true,
      paranoid: true,
    }
  );
  return EtherWallets;
};
