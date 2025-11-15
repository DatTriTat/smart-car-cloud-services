// "use strict";
//
// const PushService = require("../services/push.service");
// const {OK} = require("../core/success.response");
// const {BadRequestError, AuthFailureError, NotFoundError} = require("../core/error.response");
// const User = require("../models/sql/user.model");
//
// class PushController {
//     /**
//      * Subscribes a user to push notifications
//      * POST /api/v1/push/subscribe
//      */
//     async subscribe(request, response) {
//         const {subscription} = request.body;
//         // const cognitoUser = request.user;
//
//         // if (!cognitoUser || !cognitoUser.username) {
//         //     throw new AuthFailureError("Authentication required");
//         // }
//         if (!subscription || !subscription.endpoint) {
//             throw new BadRequestError("Invalid subscription object provided");
//         }
//
//         // Find the local user ID from the cognito username
//         if (!subscription || !subscription.userId) {
//             throw new BadRequestError("UserId is required");
//         }
//
//         await PushService.saveSubscription(subscription.userId, subscription);
//
//         return new OK({
//             message: "Subscribed to push notifications successfully",
//             data: {success: true},
//         }).send(response);
//     }
//
//     /**
//      * Returns the VAPID public key
//      * GET /api/v1/push/vapid-key
//      */
//     async getVapidKey(request, response) {
//         const publicKey = PushService.publicKey;
//         if (!publicKey) {
//             throw new Error("VAPID public key is not configured on the server");
//         }
//         return new OK({
//             message: "VAPID public key retrieved",
//             data: {publicKey},
//         }).send(response);
//     }
// }
//
// module.exports = new PushController();