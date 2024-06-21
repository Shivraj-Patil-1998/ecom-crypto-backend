'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BitcoinWallets extends Model {
    static associate(models) {
      // this.hasOne(models.Mnemonic, {
      //   foreignKey: 'id',
      //   sourceKey: 'mnemonic',
      // });
    }
  }
  BitcoinWallets.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      mnemonic: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      path: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      modelName: 'BitcoinWallets',
      tableName: 'BitcoinWallets',
      deletedAt: 'deletedAt',
      timestamps: true,
      paranoid: true,
    }
  );
  return BitcoinWallets;
};
