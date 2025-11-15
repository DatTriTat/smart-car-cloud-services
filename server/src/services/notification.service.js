"use strict"

const logger = require("../utils/logger");
const {AlertNotification} = require("../models/mongo");
const {NOTIFICATION_TYPES} = require("../types/enums");
const PushService = require("../services/push.service");
const Car = require("../models/sql/car.model");
const {BadRequestError} = require("../core/error.response");

class NotificationService {

    async sendNotification({alert, userId}) {

    }

    async sendAppPushNotification({alert, userId, car}) {
        //
        // if (!car) {
        //     throw BadRequestError("Car does not exist");
        // }
        //
        // if (!userId) {
        //     logger.warn(`Cannot send notification for alert ${alert.id}: car ${car.id} has no owner.`);
        //     return;
        // }
        //
        // // 1. Construct the payload
        // const title = `New Alert: ${alert.alertType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`;
        // const body = `A new ${alert.severity} severity alert was detected for your ${car.make} ${car.model}.`;
        //
        // // This is the payload that will be sent to the service worker
        // const payload = {
        //     title,
        //     body,
        //     data: { // 'data' is a standard field for custom info
        //         alertId: alert.id,
        //         severity: alert.severity,
        //         alertType: alert.alertType,
        //         carId: car.id,
        //         timestamp: alert.createdAt,
        //     },
        //     icon: "/icons/icon-192x192.png", // Add a path to an icon
        //     badge: "/icons/badge-72x72.png", // Add a path to a badge
        // };
        //
        // try {
        //     // 2. Log the notification to MongoDB
        //     const notification = await AlertNotification.create({
        //         alertId: alert.id,
        //         userId: userId,
        //         channel: NOTIFICATION_TYPES.IN_APP,
        //         status: "pending",
        //         subject: title,
        //         message: body,
        //         metadata: {
        //             carId: car.id,
        //             vin: car.vin,
        //             severity: alert.severity
        //         },
        //     });
        //
        //     // 3. Send the push notification
        //     // This is fire-and-forget. The push service handles retries.
        //     PushService.sendNotification(userId, payload);
        //
        //     // 4. Mark as sent in DB
        //     // Note: "sent" here means "sent to the push service", not "delivered to device"
        //     notification.status = "sent";
        //     notification.sentAt = new Date();
        //     await notification.save();
        //
        //     logger.info(`Web Push notification queued for user ${userId} for alert ${alertData.id}`);
        //
        // } catch (error) {
        //     logger.error(`Failed to log/queue notification for alert ${alertData.id}:`, error);
        //     // Optionally update DB record to 'failed'
        // }
    }

    async sendEmailNotification({notification, userId}) {

    }
}

module.exports = new NotificationService();