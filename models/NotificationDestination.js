"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class NotificationDestination extends Model {
    static associate(models) {
      ///
    }
  }
  NotificationDestination.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      destinationId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      to: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      webhook_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payload_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      modelName: "NotificationDestination",
      tableName: "NotificationDestination",
      deletedAt: "deletedAt",
      timestamps: true,
      paranoid: true,
    }
  );
  return NotificationDestination;
};
