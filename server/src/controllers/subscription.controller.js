"use strict";

const SubscriptionService = require("../services/subscription.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");
const {parseIntParam} = require("../helpers/queryParser");

class SubscriptionController {

    /**
     * Get subscriptions list
     * GET /api/v1/subscriptions
     */
    async getSubscriptions(request, response) {
        const {
            userId,
            alertType,
            page,
            limit,
            sortBy,
            sortOrder,
        } = request.query;

        const filters = {
            userId,
            alertType,
            page: parseIntParam(page, 1),
            limit: parseIntParam(limit, 10),
            sortBy: sortBy || "createdAt",
            sortOrder: sortOrder || "DESC",
        };

        const data = await SubscriptionService.getSubscriptions(filters);

        return new OK({
            message: "Subscriptions retrieved successfully",
            data,
        }).send(response);
    }

    /**
     * Get single subscription
     * GET /api/v1/subscriptions/:id
     */
    async getSubscription(request, response) {
        const {id} = request.params;
        if (!id) {
            throw new BadRequestError("Subscription ID is required");
        }

        const data = await SubscriptionService.getSubscriptionById(id);

        return new OK({
            message: "Subscription retrieved successfully",
            data,
        }).send(response);
    }

    /**
     * Create subscription
     * POST /api/v1/subscriptions
     */
    async create(request, response) {
        const {userId, notificationTypes, alertTypes} = request.body;

        if (!userId) {
            throw new BadRequestError("User ID is required");
        }

        const data = await SubscriptionService.createSubscription({
            userId,
            notificationTypes,
            alertTypes,
        });

        return new CREATED({
            message: "Subscription created successfully",
            data,
        }).send(response);
    }

    /**
     * Update subscription
     * PUT /api/v1/subscriptions/:id
     */
    async update(request, response) {
        const {id} = request.params;
        const updates = request.body;

        if (!id) {
            throw new BadRequestError("Subscription ID is required");
        }

        if (!updates || Object.keys(updates).length === 0) {
            throw new BadRequestError("Update payload is required");
        }

        const data = await SubscriptionService.updateSubscription(id, updates);

        return new OK({
            message: "Subscription updated successfully",
            data,
        }).send(response);
    }

    /**
     * Delete subscription
     * DELETE /api/v1/subscriptions/:id
     */
    async delete(request, response) {
        const {id} = request.params;

        if (!id) {
            throw new BadRequestError("Subscription ID is required");
        }

        const result = await SubscriptionService.deleteSubscription(id);

        return new OK({
            message: "Subscription deleted successfully",
            data: result,
        }).send(response);
    }
}

module.exports = new SubscriptionController();