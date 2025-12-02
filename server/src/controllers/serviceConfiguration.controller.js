"use strict";

const ServiceConfigurationService = require("../services/serviceConfiguration.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");

class ServiceConfigurationController {

    /**
     * Get configuration for a specific user
     * GET /api/v1/service-configurations/:userId
     */
    async get(request, response) {
        const {userId} = request.params;
        if (!userId) {
            throw new BadRequestError("User ID is required in path");
        }

        const data = await ServiceConfigurationService.getConfiguration(userId);

        return new OK({
            message: "Service configuration retrieved successfully",
            data,
        }).send(response);
    }

    /**
     * Create or update configuration based on a subscription
     * POST /api/v1/service-configurations/from-subscription
     * Body: { "subscriptionId": "..." }
     */
    async createFromSubscription(request, response) {
        const {subscriptionId} = request.body;
        if (!subscriptionId) {
            throw new BadRequestError("subscriptionId is required");
        }

        const data = await ServiceConfigurationService.createFromSubscription(subscriptionId);

        return new CREATED({
            message: "Service configuration created/updated from subscription",
            data,
        }).send(response);
    }

    /**
     * Update configuration settings
     * PUT /api/v1/service-configurations/:userId
     * Body: { "notificationMethods": ["email", "sms"], "alertTypes": ["engine_warning"] }
     */
    async update(request, response) {
        const {userId} = request.params;
        const updates = request.body;

        if (!userId) {
            throw new BadRequestError("User ID is required in path");
        }

        if (!updates || Object.keys(updates).length === 0) {
            throw new BadRequestError("Update payload is required");
        }

        const data = await ServiceConfigurationService.updateConfiguration(userId, updates);

        return new OK({
            message: "Service configuration updated successfully",
            data,
        }).send(response);
    }

    /**
     * Delete configuration
     * DELETE /api/v1/service-configurations/:userId
     */
    async delete(request, response) {
        const {userId} = request.params;
        if (!userId) {
            throw new BadRequestError("User ID is required in path");
        }

        const result = await ServiceConfigurationService.deleteConfiguration(userId);

        return new OK({
            message: "Service configuration deleted successfully",
            data: result,
        }).send(response);
    }
}

module.exports = new ServiceConfigurationController();