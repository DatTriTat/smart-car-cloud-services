"use strict";

const {DataTypes, Model} = require("sequelize");
const instanceDatabase = require("../../dbs/init.database");

class NotificationType extends Model {
}

NotificationType.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isLowercase: true,
            },
            set(value) {
                this.setDataValue("type", value.toLowerCase().trim());
            },
        },
    },
    {
        sequelize: instanceDatabase.getSequelize(),
        tableName: "notification_types",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["type"],
            },
        ],
    }
);

// javascript
NotificationType.findByType = function (notificationType) {
    const normalized = String(notificationType).toLowerCase().trim();
    return this.findOne({
        where: {
            type: normalized,
        },
    });
};

module.exports = NotificationType;
