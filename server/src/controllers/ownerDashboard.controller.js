"use strict";

const {OK} = require("../core/success.response");
const CarService = require("../services/car.service");
const AlertService = require("../services/alert.service");
const SubscriptionService = require("../services/subscription.service");
const ServiceConfigurationService = require("../services/serviceConfiguration.service");
const AlertType = require("../models/sql/alertType.model");
const IoTDevice = require("../models/sql/iotDevice.model");
const CarTracking = require("../models/sql/carTracking.model");
const {Op} = require("sequelize");

async function getLatestLocations(carIds) {
    if (!carIds.length) return [];
    const rows = await CarTracking.findAll({
        where: {carId: {[Op.in]: carIds}},
        order: [["createdAt", "DESC"]],
        raw: true,
    });
    const seen = new Set();
    const latest = [];
    for (const row of rows) {
        if (seen.has(row.carId)) continue;
        seen.add(row.carId);
        latest.push({
            carId: row.carId,
            latitude: row.latitude,
            longitude: row.longitude,
            lastSeenAt: row.createdAt,
        });
    }
    return latest;
}

class OwnerDashboardController {
    async getDashboard(request, response) {
        const userId = request.user?.id || request.query.userId;

        const carsResult = await CarService.getCars({userId, limit: 1000});
        const cars = carsResult?.cars || [];
        const carIds = cars.map((c) => c.id);

        const alertsResult = await AlertService.getAlerts({
            userId,
            limit: 1000,
        });
        const alerts = alertsResult?.alerts || [];

        const devices = await IoTDevice.findAll({
            where: userId ? {userId} : undefined,
            raw: true,
        });

        let subscription = null;
        try {
            const subs = await SubscriptionService.getSubscriptions({
                userId,
                limit: 1,
            });
            subscription = subs?.subscriptions?.[0] || null;
        } catch {
            subscription = null;
        }

        let serviceConfig = null;
        try {
            serviceConfig = userId
                ? await ServiceConfigurationService.getConfiguration(userId)
                : null;
        } catch {
            serviceConfig = null;
        }

        const alertTypes = await AlertType.findAll({raw: true});
        const carLocations = await getLatestLocations(carIds);

        return new OK({
            message: "Owner dashboard fetched",
            data: {
                owner: request.user || null,
                cars,
                alerts,
                devices,
                carServiceConfigs: serviceConfig ? [serviceConfig] : [],
                subscription,
                carLocations,
                aiModels: [],
                alertTypes,
            },
        }).send(response);
    }

    async refreshDashboard(request, response) {
        // With DB-backed data, refresh just re-fetches live data
        return this.getDashboard(request, response);
    }
}

module.exports = new OwnerDashboardController();
