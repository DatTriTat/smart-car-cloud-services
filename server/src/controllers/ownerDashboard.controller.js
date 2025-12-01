"use strict";

const { OK } = require("../core/success.response");
const CarService = require("../services/car.service");
const AlertService = require("../services/alert.service");
const SubscriptionService = require("../services/subscription.service");
const ServiceConfigurationService = require("../services/serviceConfiguration.service");
const AlertType = require("../models/sql/alertType.model");
const IoTDevice = require("../models/sql/iotDevice.model");
const CarTracking = require("../models/sql/carTracking.model");
const User = require("../models/sql/user.model");
const { Op } = require("sequelize");

async function getLatestLocations(carIds) {
  if (!carIds.length) return [];
  const rows = await CarTracking.findAll({
    where: { carId: { [Op.in]: carIds } },
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
  async getDashboard(req, res) {
    const userId = req.user?.id || req.query.userId;

    const owner =
      userId &&
      (await User.findByPk(userId, {
        attributes: ["id", "username", "name", "email", "role"],
        raw: true,
      }));

    const carsResult = await CarService.getCars({ userId, limit: 1000 });
    const cars = carsResult?.cars || [];
    const carIds = cars.map((c) => c.id);

    const alertsResult = await AlertService.getAlerts({ userId, limit: 1000 });
    const alerts = alertsResult?.alerts || [];

    const devices = await IoTDevice.findAll({
      where: userId ? { userId } : undefined,
      raw: true,
    });

    const subscription =
      (await SubscriptionService.getSubscriptions({ userId, limit: 1 }))
        ?.subscriptions?.[0] || null;

    const serviceConfig = userId
      ? await ServiceConfigurationService.getConfiguration(userId).catch(
          () => null
        )
      : null;

    const alertTypes = await AlertType.findAll({
      raw: true,
      attributes: ["type"],
    });
    const carLocations = await getLatestLocations(carIds);

    return new OK({
      message: "Owner dashboard fetched",
      data: {
        owner: owner || null,
        cars,
        alerts,
        devices,
        carServiceConfigs: serviceConfig ? [serviceConfig] : [],
        subscription,
        carLocations,
        aiModels: [],
        alertTypes,
      },
    }).send(res);
  }

  async refreshDashboard(req, res) {
    return this.getDashboard(req, res);
  }
}

module.exports = new OwnerDashboardController();
