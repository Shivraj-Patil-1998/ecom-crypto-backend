'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubWalletAddress extends Model {
    static associate(models) {
      this.belongsTo(models.SubWalletName, {
        foreignKey: 'subWalletId',
        targetKey: 'subWalletId',
      });
    }
  }
  SubWalletAddress.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subWalletId: {
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

      balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      alertStatus: {
        type: DataTypes.BOOLEAN,
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
      modelName: 'SubWalletAddress',
      tableName: 'SubWalletAddress',
      deletedAt: 'deletedAt',
      timestamps: true,
      paranoid: true,
    }
  );
  return SubWalletAddress;
};
