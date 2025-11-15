"use strict";

const express = require("express");
const PushController = require("../../controllers/push.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

const router = express.Router();

// Get the server's VAPID public key
router.get(
    "/vapid-key",
    asyncErrorHandler(PushController.getVapidKey)
);

// Save a new subscription
router.post(
    "/subscribe",
    asyncErrorHandler(PushController.subscribe)
);

module.exports = router;