// Import necessary modules
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubWalletName extends Model {
    static associate(models) {
      this.hasMany(models.SubWalletAddress, {
        foreignKey: 'subWalletId',
        sourceKey: 'subWalletId',
      });
    }
  } // Define a new model for generating SubWalletName
  SubWalletName.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subWalletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: 'SubWalletName',
      tableName: 'SubWalletName',
      timestamps: true,
      paranoid: true,
    }
  );
  return SubWalletName;
};
