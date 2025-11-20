// "use strict";
//
// const webpush = require("web-push");
// const PushSubscription = require("../models/sql/pushSubscription.model");
// const logger = require("../utils/logger");
// const {User} = require("../models/sql");
// const {BadRequestError} = require("../core/error.response");
//
// class PushService {
//     constructor() {
//         this.publicKey = process.env.VAPID_PUBLIC_KEY;
//         this.privateKey = process.env.VAPID_PRIVATE_KEY;
//         this.subject = process.env.VAPID_SUBJECT;
//
//         if (this.publicKey && this.privateKey && this.subject) {
//             webpush.setVapidDetails(this.subject, this.publicKey, this.privateKey);
//             logger.info("Web Push VAPID keys configured.");
//         } else {
//             logger.warn(
//                 "VAPID keys not configured. Web Push notifications will be disabled."
//             );
//         }
//     }
//
//     /**
//      * Saves a new push subscription for a user.
//      */
//     async saveSubscription(userId, subscription) {
//         try {
//             if (!userId || !subscription || !subscription.endpoint) {
//                 throw new Error("Invalid subscription data");
//             }
//
//             const existingUser = User.findByPk(userId);
//             if (!existingUser) {
//                 throw new BadRequestError("User does not exist");
//             }
//
//             // Find or create the subscription
//             const [savedSub, created] = await PushSubscription.findOrCreate({
//                 where: {endpoint: subscription.endpoint},
//                 defaults: {
//                     userId: userId,
//                     endpoint: subscription.endpoint,
//                     p256dh: subscription.keys.p256dh,
//                     auth: subscription.keys.auth,
//                 },
//             });
//
//             if (!created && savedSub.userId !== userId) {
//                 // Subscription exists but belongs to a different user, update it
//                 savedSub.userId = userId;
//                 await savedSub.save();
//                 logger.warn(`Subscription endpoint reassigned to user ${userId}`);
//             }
//
//             logger.info(`Subscription saved for user ${userId}`);
//             return savedSub;
//         } catch (error) {
//             throw error;
//         }
//
//     }
//
//     /**
//      * Sends a push notification to all stored subscriptions for a given user.
//      */
//     async sendNotification(userId, payload) {
//         if (!this.privateKey) {
//             logger.warn("Cannot send push notification: VAPID keys not set.");
//             return;
//         }
//
//         try {
//             const subscriptions = await PushSubscription.findByUser(userId);
//             if (subscriptions.length === 0) {
//                 logger.debug(`No push subscriptions found for user ${userId}`);
//                 return;
//             }
//
//             const payloadString = JSON.stringify(payload);
//
//             const sendPromises = subscriptions.map((sub) => {
//                 const pushConfig = {
//                     endpoint: sub.endpoint,
//                     keys: {
//                         p256dh: sub.p256dh,
//                         auth: sub.auth,
//                     },
//                 };
//
//                 return webpush
//                     .sendNotification(pushConfig, payloadString)
//                     .catch(async (err) => {
//                         logger.error(`Error sending push to ${sub.endpoint}: ${err.message}`);
//                         // If subscription is expired or invalid (410 Gone, 404 Not Found), remove it.
//                         if (err.statusCode === 410 || err.statusCode === 404) {
//                             logger.info(`Removing expired subscription for user ${userId}`);
//                             await sub.destroy();
//                         }
//                     });
//             });
//
//             await Promise.all(sendPromises);
//             logger.info(`Push notifications sent to ${subscriptions.length} endpoint(s) for user ${userId}`);
//
//         } catch (error) {
//             logger.error(`Failed to send notifications for user ${userId}:`, error);
//         }
//     }
//
// }
//
// module.exports = new PushService();