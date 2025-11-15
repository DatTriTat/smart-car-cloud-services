// "use strict";
//
// const {DataTypes, Model} = require("sequelize");
// const instanceDatabase = require("../../dbs/init.database");
//
// class PushSubscription extends Model {
// }
//
// PushSubscription.init(
//     {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true,
//             allowNull: false,
//         },
//         userId: {
//             type: DataTypes.UUID,
//             allowNull: true,
//             field: "user_id",
//             references: {
//                 model: "users",
//                 key: "id",
//             },
//             onUpdate: "CASCADE",
//             onDelete: "CASCADE",
//         },
//         endpoint: {
//             type: DataTypes.TEXT,
//             allowNull: true,
//             unique: true,
//         },
//         p256dh: {
//             type: DataTypes.STRING(255),
//             allowNull: true,
//             field: "key_p256dh",
//         },
//         auth: {
//             type: DataTypes.STRING(255),
//             allowNull: true,
//             field: "key_auth",
//         },
//         createdAt: {
//             type: DataTypes.DATE,
//             allowNull: true,
//             defaultValue: DataTypes.NOW,
//             field: "created_at",
//         },
//     },
//     {
//         sequelize: instanceDatabase.getSequelize(),
//         tableName: "push_subscriptions",
//         timestamps: false,
//         underscored: true,
//         indexes: [
//             {fields: ["user_id"]},
//             {unique: true, fields: ["endpoint"]},
//             {fields: ["user_id", "endpoint"]},
//         ],
//     }
// );
//
// // Custom methods
// PushSubscription.findByUser = function (userId) {
//     return this.findAll({where: {userId}});
// };
//
// PushSubscription.findByEndpoint = function (endpoint) {
//     return this.findOne({where: {endpoint}});
// };
//
// module.exports = PushSubscription;