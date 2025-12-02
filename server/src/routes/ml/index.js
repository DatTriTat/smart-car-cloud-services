"use strict";

const express = require("express");
const multer = require("multer");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const MLController = require("../../controllers/ml.controller");

const router = express.Router();

// Limit payload to ~6MB (SageMaker sync invoke limit)
const upload = multer({
  limits: { fileSize: 6 * 1024 * 1024 },
});

router.post(
  "/classify-cloud",
  upload.single("file"),
  asyncErrorHandler(MLController.classifyCloud)
);

module.exports = router;
