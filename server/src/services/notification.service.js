"use strict"

const logger = require("../utils/logger");
const {AlertNotification} = require("../models/mongo");
const {NOTIFICATION_TYPES} = require("../types/enums");
const PushService = require("../services/push.service");
const ServiceConfiguration = require("../models/sql/serviceConfiguration.model");
const {BadRequestError} = require("../core/error.response");
const {pushToUser} = require("../services/sse.service");
const NotificationType = require("../models/sql/notificationType.model");

class NotificationService {

    async sendNotification({alert, userId}) {
        const userConfig = await ServiceConfiguration.findByUser(userId);
        if (!userConfig) {
            return false;
        }

        const methods = Array.isArray(userConfig.notificationMethods) ? userConfig.notificationMethods : [];
        const methodIds = Array.isArray(userConfig.notificationMethods)
            ? userConfig.notificationMethods
            : [];
        const alertTypes = Array.isArray(userConfig.alertTypes)
            ? userConfig.alertTypes :
            [];

        const allTypes = await NotificationType.findAll();
        const idToType = new Map(
            allTypes.map(t => [String(t.id), String(t.type).toLowerCase()])
        );

        const methodTypes = methodIds
            .map(id => idToType.get(String(id)))
            .filter(Boolean);

        const isMatchedAlertType = alertTypes.some(
            t => String(t).toLowerCase() === String(alert.alertType).toLowerCase());
        const isInAppMethod = methodTypes.some(
            t => t === String(NOTIFICATION_TYPES.IN_APP).toLowerCase()
        );

        if (isInAppMethod && isMatchedAlertType) {
            await this.sendAppPushNotification({alert, userId});
        }
        // Add if have other notification methods
    }

    async sendAppPushNotification({alert, userId}) {
        try {
            const notification = await AlertNotification.create({
                alertId: alert.id,
                userId: userId,
                channel: NOTIFICATION_TYPES.IN_APP,
                status: "pending",
                subject: `Notification for ${alert.id}`,
                message: "Push Notification",
                metadata: alert,
            });
            // Send notification by app push
            pushToUser(userId, alert);

            notification.status = "sent";
            notification.sentAt = new Date();
            await notification.save();

        } catch (error) {
            logger.error("Fail to send in-app notification with err: ", error);
        }

    }

    // async sendEmailNotification({notification, userId}) {
    // }
}

module.exports = new NotificationService();