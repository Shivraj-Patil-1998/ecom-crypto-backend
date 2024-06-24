"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Transactions extends Model {
    static associate(models) {
      // Associations can be defined here
    }
  }
  Transactions.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      assetId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactiontype: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fromAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      toAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      exactAmount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fee: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      merchantId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "Transactions",
      tableName: "Transactions",
      deletedAt: "deletedAt",
      timestamps: true,
      paranoid: true,
    }
  );
  return Transactions;
};
