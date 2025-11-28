"use strict";

const AlertThresholdService = require("../services/alertThreshold.service");
const { OK, CREATED } = require("../core/success.response");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const parseNonNegativeInt = (value) => {
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
};

const parseMinThreshold = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > 1) {
    throw new BadRequestError("minThreshold must be a number between 0 and 1");
  }
  return numeric;
};

class AlertThresholdController {
  async list(request, response) {
    const limit = parseNonNegativeInt(request.query.limit);
    const offset = parseNonNegativeInt(request.query.offset);

    const data = await AlertThresholdService.list({ limit, offset });

    return new OK({ message: "Alert thresholds retrieved successfully", data }).send(response);
  }

  async getById(request, response) {
    const { id } = request.params;

    const data = await AlertThresholdService.getById(id);
    if (!data) throw new NotFoundError("AlertThreshold not found");

    return new OK({ message: "Alert threshold retrieved successfully", data }).send(response);
  }

  async getByType(request, response) {
    const { alertType } = request.params;

    const data = await AlertThresholdService.getByType(alertType);
    if (!data) throw new NotFoundError("AlertThreshold not found");

    return new OK({ message: "Alert threshold retrieved successfully", data }).send(response);
  }

  async create(request, response) {
    const { alertType, minThreshold } = request.body || {};
    if (!alertType) throw new BadRequestError("alertType is required");
    const normalizedMinThreshold = parseMinThreshold(minThreshold);

    const data = await AlertThresholdService.create({
      alertType,
      minThreshold: normalizedMinThreshold,
    });

    return new CREATED({ message: "Alert threshold created successfully", data }).send(response);
  }

  async update(request, response) {
    const { id } = request.params;
    const { alertType, minThreshold } = request.body || {};

    if (alertType == null && minThreshold == null) {
      throw new BadRequestError("Provide at least one field to update");
    }

    const data = await AlertThresholdService.updateById(id, {
      alertType,
      minThreshold: minThreshold !== undefined ? parseMinThreshold(minThreshold) : undefined,
    });

    return new OK({ message: "Alert threshold updated successfully", data }).send(response);
  }

  async patch(request, response) {
    const { id } = request.params;
    const { alertType, minThreshold } = request.body || {};

    if (alertType == null && minThreshold == null) {
      throw new BadRequestError("Provide at least one field to update");
    }

    const data = await AlertThresholdService.updateById(id, {
      alertType,
      minThreshold: minThreshold !== undefined ? parseMinThreshold(minThreshold) : undefined,
    });

    return new OK({ message: "Alert threshold updated successfully", data }).send(response);
  }

  async delete(request, response) {
    const { id } = request.params;

    const result = await AlertThresholdService.deleteById(id);
    if (!result.deleted) throw new NotFoundError("AlertThreshold not found");

    return new OK({ message: "Alert threshold deleted successfully", data: result }).send(response);
  }
}

module.exports = new AlertThresholdController();
