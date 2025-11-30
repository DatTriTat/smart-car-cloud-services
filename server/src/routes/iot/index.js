"use strict";

const express = require("express");
const router = express.Router();

const IotDashboardController = require("../../controllers/iotDashboard.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const {authenticate} = require("../../middlewares/auth.middleware");

router.get("/dashboard", authenticate, asyncErrorHandler(IotDashboardController.getDevices.bind(IotDashboardController)));
router.post("/dashboard/refresh", authenticate, asyncErrorHandler(IotDashboardController.refresh.bind(IotDashboardController)));

module.exports = router;
