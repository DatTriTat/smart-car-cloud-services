"use strict"

const Car = require("../models/sql/car.model");
const User = require("../models/sql/user.model");
const logger = require("../utils/logger");
const {Op} = require("sequelize");
const {NotFoundError, BadRequestError, ConflictRequestError} = require("../core/error.response");
const {CAR_STATUS} = require("../types/enums");

class CarService {

    async getCars(filter = {}) {
        try {
            const {
                vin,
                make,
                model,
                year,
                registrationDate,
                status,
                userId,
                page = 1,
                limit = 10,
                sortBy = "createdAt",
                sortOrder = "DESC",
            } = filter;

            const where = {};

            if (vin) where.vin = {[Op.iLike]: `%${vin}%`};
            if (make) where.make = {[Op.iLike]: `%${make}%`};
            if (model) where.model = {[Op.iLike]: `%${model}%`};
            if (year) where.year = year;
            if (status) where.status = status;
            if (userId) where.userId = userId;
            if (registrationDate) {
                where.registrationDate = new Date(registrationDate);
            }

            const offset = (page - 1) * limit;

            const {count, rows} = await Car.findAndCountAll({
                where,
                limit: limit,
                offset: offset,
                order: [[sortBy, sortOrder]],
                include: [
                    {
                        model: User,
                        as: "owner",
                        attributes: ["id", "username", "email", "name"],
                    },
                ],
            });

            return {
                cars: rows,
                pagination: {
                    total: count,
                    page: parseInt(page, 10),
                    limit: parseInt(limit, 10),
                    totalPages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            logger.error("Error fetching cars:", error);
            throw error;
        }
    }

    async getCarById(carId) {
        try {
            const car = await Car.findByPk(carId, {
                include: [
                    {
                        model: User,
                        as: "owner",
                        attributes: ["id", "username", "email", "name", "phone"],
                    },
                ],
            });

            if (!car) {
                throw new NotFoundError("Car not found");
            }

            return car;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            logger.error(`Error fetching car ${carId}:`, error);
            throw error;
        }

    }

    async createCar(payload) {
        const {vin, make, model, year, registrationDate, userId} = payload;

        if (!vin || !make || !model || !year || !userId) {
            throw new BadRequestError("Missing required fields: vin, make, model, year, userId");
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const normalizedVin = vin.toUpperCase().trim();
        const existingCar = await Car.findOne({where: {vin: normalizedVin}});

        if (existingCar) {
            throw new ConflictRequestError(`Car with VIN ${normalizedVin} already exists`);
        }

        try {
            return await Car.create({
                vin,
                make,
                model,
                year,
                registrationDate,
                userId,
                status: CAR_STATUS.INACTIVE,
            });

        } catch (error) {
            logger.error("Error creating car:", error);
            throw error;
        }
    }

    async updateCar(carId, payload) {
        if (!carId) {
            throw new BadRequestError("Car ID is required");
        }

        const car = await Car.findByPk(carId);
        if (!car) {
            throw new NotFoundError("Car not found");
        }

        const updates = {...payload};
        delete updates.id;
        // delete updates.createdAt;
        // delete updates.updatedAt;

        // Handle VIN updates specifically
        if (updates.vin) {
            const normalizedVin = updates.vin.toUpperCase().trim();

            const duplicate = await Car.findOne({
                where: {
                    vin: normalizedVin,
                    id: {[Op.ne]: carId}
                }
            });

            if (duplicate) {
                throw new ConflictRequestError(`Car with VIN ${normalizedVin} already exists`);
            }

            updates.vin = normalizedVin;
        }

        if (updates.userId) {
            const userExists = await User.findByPk(updates.userId);
            if (!userExists) {
                throw new NotFoundError("New owner (user) not found");
            }
        }

        try {
            await car.update(updates);

            return car;

        } catch (error) {
            logger.error(`Error updating car ${carId}:`, error);
            throw error;
        }
    }

    async deleteCar(carId) {
        if (!carId) {
            throw new BadRequestError("Car ID is required");
        }

        try {
            const car = await Car.findByPk(carId);
            if (!car) {
                throw new NotFoundError("Car not found");
            }

            const {vin, id} = car;
            await car.destroy();

            logger.info(`Car deleted successfully: ${id} (VIN: ${vin})`);
            return {deleted: true, id};

        } catch (error) {
            logger.error(`Error deleting car ${carId}:`, error);
            throw error;
        }
    }
}

module.exports = new CarService();