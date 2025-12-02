"use strict"

const express = require("express");
const router = express.Router();

const SubscriptionController = require("../../controllers/subscription.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.get("", asyncErrorHandler(SubscriptionController.getSubscriptions));
router.post("", asyncErrorHandler(SubscriptionController.create))
router.get("/:id", asyncErrorHandler(SubscriptionController.getSubscription));
router.put("/:id", asyncErrorHandler(SubscriptionController.update));
router.delete("/:id", asyncErrorHandler(SubscriptionController.delete));

module.exports = router;