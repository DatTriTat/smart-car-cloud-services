"use strict";

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../dbs/init.database").getSequelize();

class User extends Model {
  async deactivate() {
    this.isActive = false;
    await this.save();
    return this;
  }

  async activate() {
    this.isActive = true;
    await this.save();
    return this;
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.password; // If we ever store passwords
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50],
      },
      set(value) {
        this.setDataValue("username", value.toLowerCase().trim());
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "staff"),
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin", "staff"]],
      },
    },
    cognitoSub: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: "cognito_sub",
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "email_verified",
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_login",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
      {
        unique: true,
        fields: ["email"],
      },
      {
        unique: true,
        fields: ["cognito_sub"],
      },
      {
        fields: ["role"],
      },
      {
        fields: ["is_active"],
      },
      {
        fields: ["username", "is_active"],
      },
      {
        fields: ["role", "is_active"],
      },
    ],
  }
);

User.findActive = function () {
  return this.findAll({ where: { isActive: true } });
};

User.findByRole = function (role) {
  return this.findAll({ where: { role, isActive: true } });
};

User.findByUsername = function (username) {
  return this.findOne({ where: { username: username.toLowerCase() } });
};

User.findByCognitoSub = function (cognitoSub) {
  return this.findOne({ where: { cognitoSub } });
};

module.exports = User;