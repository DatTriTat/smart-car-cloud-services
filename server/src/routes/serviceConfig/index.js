"use strict"

const express = require("express");
const router = express.Router();

const ServiceConfigurationController = require("../../controllers/serviceConfiguration.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("", asyncErrorHandler(ServiceConfigurationController.createFromSubscription));
router.get("/:userId", asyncErrorHandler(ServiceConfigurationController.get));
router.put("/:userId", asyncErrorHandler(ServiceConfigurationController.update));
router.delete("/:userId", asyncErrorHandler(ServiceConfigurationController.delete));

module.exports = router;