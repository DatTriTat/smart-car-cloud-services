"use strict"

const express = require("express");
const router = express.Router();

const CarController = require("../../controllers/car.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.get("", asyncErrorHandler(CarController.getCars));
router.post("", asyncErrorHandler(CarController.create));
router.get("/:carId", asyncErrorHandler(CarController.getCar));
router.put("/:carId", asyncErrorHandler(CarController.update));
router.delete("/:carId", asyncErrorHandler(CarController.delete));

module.exports = router;