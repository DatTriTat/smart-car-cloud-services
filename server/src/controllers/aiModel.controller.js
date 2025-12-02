"use strict";

const { OK, CREATED } = require("../core/success.response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const MLService = require("../services/ml.service");
const AiModel = require("../models/mongo/aiModel.model");
const logger = require("../utils/logger");

class AiModelController {
  async list(req, res) {
    const models = await AiModel.find().sort({ updatedAt: -1 }).lean();
    return new OK({ message: "AI models fetched", data: models }).send(res);
  }

  async create(req, res) {
    const { name, type, version, status } = req.body || {};
    if (!name || !type) {
      throw new BadRequestError("name and type are required");
    }
    const model = await AiModel.create({
      name,
      type,
      version: version || "v1.0.0",
      status: status || "RUNNING",
    });
    return new CREATED({ message: "AI model created", data: model }).send(res);
  }

  async classify(req, res) {
    const { id } = req.params;
    const model = await AiModel.findById(id);
    if (!model) throw new NotFoundError("Model not found");

    const file = req.file;
    if (!file) throw new BadRequestError("Audio file is required (field name: file)");

    const result = await MLService.classifyWithSageMaker({
      buffer: file.buffer,
      contentType: file.mimetype || "audio/wave",
      filename: file.originalname,
    });

    model.results.push({
      filename: result.filename,
      contentType: result.contentType,
      fileSizeBytes: result.fileSizeBytes,
      predictedClass: result.predictedClass,
      confidence: result.confidence,
      probabilities: result.probabilities,
      raw: result.raw,
      success: result.success,
      endpoint: result.endpoint,
      region: result.region,
    });
    model.updatedAt = new Date();
    await model.save();

    logger.info("Stored ML result for model", { id: model._id, predictedClass: result.predictedClass });

    return new OK({
      message: "Classification completed",
      data: { modelId: model._id, ...result },
    }).send(res);
  }
}

module.exports = new AiModelController();
