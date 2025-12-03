"use strict";

const {Op} = require("sequelize");
const ServiceConfiguration = require("../models/sql/serviceConfiguration.model");
const Subscription = require("../models/sql/subscription.model");
const NotificationType = require("../models/sql/notificationType.model");
const {NotFoundError, BadRequestError} = require("../core/error.response");
const logger = require("../utils/logger");

class ServiceConfigurationService {

    async getConfiguration(userId) {
        if (!userId) {
            throw new BadRequestError("User ID is required");
        }

        try {
            const config = await ServiceConfiguration.findByUser(userId);

            if (!config) {
                throw new NotFoundError("Service configuration not found");
            }

            const configData = config.toJSON();

            if (configData.notificationMethods && configData.notificationMethods.length > 0) {
                const types = await NotificationType.findAll({
                    where: {
                        id: {
                            [Op.in]: configData.notificationMethods
                        }
                    },
                    attributes: ["type"]
                });

                configData.notificationMethods = types.map(t => t.type);
            }

            return configData;

        } catch (error) {
            logger.error(`Error fetching service configuration for user ${userId}:`, error);
            throw error;
        }
    }

    async createFromSubscription(subscriptionId) {
        if (!subscriptionId) {
            throw new BadRequestError("Subscription ID is required");
        }

        try {
            const subscription = await Subscription.findByPk(subscriptionId);
            if (!subscription) {
                throw new NotFoundError("Subscription not found");
            }

            const {userId, notificationTypes, alertTypes} = subscription;

            const configPayload = {
                userId,
                notificationMethods: notificationTypes,
                alertTypes: alertTypes,
            };

            const [config, created] = await ServiceConfiguration.findOrCreate({
                where: {userId},
                defaults: configPayload,
            });

            if (!created) {
                await config.update(configPayload);
            }

            return config;

        } catch (error) {
            logger.error(`Error creating config from subscription ${subscriptionId}:`, error);
            throw error;
        }
    }

    async updateConfiguration(userId, updates) {
        if (!userId) {
            throw new BadRequestError("User ID is required");
        }

        try {
            const config = await ServiceConfiguration.findByUser(userId);
            if (!config) {
                throw new NotFoundError("Service configuration not found");
            }

            const subscription = await Subscription.findByUser(userId);
            if (!subscription) {
                throw new NotFoundError("No active subscription found for this user");
            }

            if (updates.notificationMethods) {
                const methods = Array.isArray(updates.notificationMethods)
                    ? updates.notificationMethods
                    : [updates.notificationMethods];

                const normalizedMethods = methods.map(m => String(m).toLowerCase().trim());

                if (normalizedMethods.length > 0) {
                    const types = await NotificationType.findAll({
                        where: {
                            type: {[Op.in]: normalizedMethods}
                        }
                    });

                    if (types.length !== normalizedMethods.length) {
                        throw new BadRequestError("One or more invalid notification methods provided");
                    }

                    // Verify IDs are present in the user's Subscription
                    const requestedIds = types.map(t => t.id);
                    const subscribedIds = new Set(subscription.notificationTypes || []);

                    const isAllowed = requestedIds.every(id => subscribedIds.has(id));
                    if (!isAllowed) {
                        throw new BadRequestError("You cannot enable notification methods that are not in your subscription");
                    }

                    config.notificationMethods = requestedIds;
                } else {
                    config.notificationMethods = [];
                }
            }

            if (updates.alertTypes) {
                const alerts = Array.isArray(updates.alertTypes)
                    ? updates.alertTypes
                    : [updates.alertTypes];

                config.alertTypes = alerts;
            }

            await config.save();

            return await this.getConfiguration(userId);

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const msg = error.errors.map(e => e.message).join(', ');
                throw new BadRequestError(`Validation failed: ${msg}`);
            }
            logger.error(`Error updating configuration for user ${userId}:`, error);
            throw error;
        }
    }

    async deleteConfiguration(userId) {
        if (!userId) {
            throw new BadRequestError("User ID is required");
        }

        try {
            const config = await ServiceConfiguration.findByUser(userId);
            if (!config) {
                throw new NotFoundError("Service configuration not found");
            }

            await config.destroy();
            logger.info(`Service configuration deleted for user ${userId}`);

            return {deleted: true, userId};

        } catch (error) {
            logger.error(`Error deleting configuration for user ${userId}:`, error);
            throw error;
        }
    }
}

module.exports = new ServiceConfigurationService();
