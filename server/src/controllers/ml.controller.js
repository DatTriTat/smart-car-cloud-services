"use strict";

const MLService = require("../services/ml.service");
const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class MLController {
  async classifyCloud(req, res) {
    const file = req.file;
    if (!file) throw new BadRequestError("Audio file is required (field name: file)");

    const result = await MLService.classifyWithSageMaker({
      buffer: file.buffer,
      contentType: file.mimetype || "audio/wav",
      filename: file.originalname,
    });

    return new OK({
      message: "Cloud classification successful",
      data: result,
    }).send(res);
  }
}

module.exports = new MLController();
