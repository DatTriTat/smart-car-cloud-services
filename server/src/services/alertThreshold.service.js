"use strict";

const AlertThreshold = require("../models/sql/alertThreshold.model");
const AlertType = require("../models/sql/alertType.model"); // to pre-check FK existence
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");

const toPlain = (thresholdInstance) => {
  if (!thresholdInstance) return null;
  const obj = thresholdInstance.toJSON();
  return { ...obj, minThreshold: parseFloat(obj.minThreshold) };
};

const normalizeAlertType = async (alertType) => {
  if (!alertType || typeof alertType !== "string") {
    throw new BadRequestError("alertType must be a non-empty string");
  }
  const normalized = alertType.toLowerCase().trim();
  const typeExists = await AlertType.findByPk(normalized);
  if (!typeExists) {
    throw new BadRequestError(`Unknown alertType '${normalized}'`);
  }
  return normalized;
};

const parseMinThreshold = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    throw new BadRequestError("minThreshold must be a number");
  }
  if (numeric < 0 || numeric > 1) {
    throw new BadRequestError("minThreshold must be between 0 and 1");
  }
  return numeric;
};

const mapSequelizeError = (err, alertType) => {
  if (err.name === "SequelizeUniqueConstraintError") {
    return new ConflictRequestError(`Threshold for alertType '${alertType}' already exists`);
  }
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return new BadRequestError(`Invalid alertType '${alertType}'`);
  }
  if (err.name === "SequelizeValidationError") {
    return new BadRequestError(err.message);
  }
  return err;
};

module.exports = {
  async list({ limit = 50, offset = 0, order = [["alertType", "ASC"]] } = {}) {
    const rows = await AlertThreshold.findAll({ limit, offset, order });
    return rows.map(toPlain);
  },

  async getById(id) {
    const row = await AlertThreshold.findByPk(id);
    return toPlain(row);
  },

  async getByType(alertType) {
    const normalized = typeof alertType === "string" ? alertType.toLowerCase().trim() : alertType;
    const row = await AlertThreshold.findByAlertType(normalized);
    return toPlain(row);
  },

  async create({ alertType, minThreshold }) {
    const normalizedType = await normalizeAlertType(alertType);
    const value = parseMinThreshold(minThreshold);

    try {
      const created = await AlertThreshold.create({
        alertType: normalizedType,
        minThreshold: value,
      });
      return toPlain(created);
    } catch (err) {
      throw mapSequelizeError(err, normalizedType);
    }
  },

  async updateById(id, { alertType, minThreshold } = {}) {
    const row = await AlertThreshold.findByPk(id);
    if (!row) {
      throw new NotFoundError("AlertThreshold not found");
    }

    try {
      if (alertType !== undefined) {
        row.alertType = await normalizeAlertType(alertType);
      }

      if (minThreshold !== undefined) {
        row.minThreshold = parseMinThreshold(minThreshold);
      }

      await row.save();
      return toPlain(row);
    } catch (err) {
      throw mapSequelizeError(err, row.alertType);
    }
  },

  /**
   * Delete by id
   */
  async deleteById(id) {
    const count = await AlertThreshold.destroy({ where: { id } });
    return { deleted: count > 0 };
  },
};
