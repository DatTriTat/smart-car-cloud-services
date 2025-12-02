"use strict"

const express = require("express");
const router = express.Router();

const SSEController = require("../../controllers/sse.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.get("", asyncErrorHandler(SSEController.connect));
// router.post("/notify", asyncErrorHandler(SSEController.test));

module.exports = router;