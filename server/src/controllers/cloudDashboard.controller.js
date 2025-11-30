"use strict";

const {OK} = require("../core/success.response");
const AlertType = require("../models/sql/alertType.model");
const CarService = require("../services/car.service");
const AlertService = require("../services/alert.service");

class CloudDashboardController {
    async getOverview(request, response) {
        const userId = request.user?.id || request.query.userId;
        const carsResult = await CarService.getCars({userId, limit: 1000});
        const cars = carsResult?.cars || [];

        const alertsResult = await AlertService.getAlerts({
            userId,
            limit: 200,
        });
        const alerts = alertsResult?.alerts || [];

        const alertTypes = await AlertType.findAll({raw: true});

        return new OK({
            message: "Cloud overview fetched",
            data: {
                aiModels: [], // not stored in DB yet
                alertTypes,
                alerts,
                cars,
            },
        }).send(response);
    }

    async refresh(request, response) {
        return this.getOverview(request, response);
    }
}

module.exports = new CloudDashboardController();
