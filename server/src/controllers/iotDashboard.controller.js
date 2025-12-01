"use strict";

const {OK} = require("../core/success.response");
const IoTDevice = require("../models/sql/iotDevice.model");
const CarService = require("../services/car.service");

class IotDashboardController {
    async getDevices(request, response) {
        const userId = request.user?.id || request.query.userId;
        const carId = request.query.carId;

        const carsResult = await CarService.getCars({userId, limit: 1000});
        const cars = carsResult?.cars || [];

        const where = {};
        if (userId) where.userId = userId;
        if (carId) where.carId = carId;

        const devices = await IoTDevice.findAll({where, raw: true});

        return new OK({
            message: "IoT devices fetched",
            data: {devices, cars},
        }).send(response);
    }

    async refresh(request, response) {
        return this.getDevices(request, response);
    }
}

module.exports = new IotDashboardController();
