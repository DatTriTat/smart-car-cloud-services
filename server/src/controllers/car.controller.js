"use strict";

const CarService = require("../services/car.service");
const {OK, CREATED} = require("../core/success.response");
const {BadRequestError} = require("../core/error.response");
const {parseIntParam} = require("../helpers/queryParser");

class CarController {
    /**
     * Get a list of cars with filtering and pagination
     * GET /api/v1/cars
     */
    async getCars(request, response) {
        const {
            vin,
            make,
            model,
            year,
            registrationDate,
            status,
            userId,
            page,
            limit,
            sortBy,
            sortOrder,
        } = request.query;

        const filters = {
            vin,
            make,
            model,
            year: parseIntParam(year, undefined),
            registrationDate,
            status,
            userId,
            page: parseIntParam(page, 1),
            limit: parseIntParam(limit, 10),
            sortBy,
            sortOrder,
        };

        const result = await CarService.getCars(filters);

        return new OK({
            message: "Cars retrieved successfully",
            data: result,
        }).send(response);
    }

    /**
     * Get a single car by ID
     * GET /api/v1/cars/:carId
     */
    async getCar(request, response) {
        const {carId} = request.params;
        if (!carId) {
            throw new BadRequestError("Car ID is required");
        }

        const car = await CarService.getCarById(carId);

        return new OK({
            message: "Car retrieved successfully",
            data: car,
        }).send(response);
    }

    /**
     * Create a new car
     * POST /api/v1/cars
     */
    async create(request, response) {
        const payload = request.body;
        
        // if (request.user && !payload.userId) {
        //     payload.userId = request.user.id;
        // }

        const newCar = await CarService.createCar(payload);

        return new CREATED({
            message: "Car created successfully",
            data: newCar,
        }).send(response);
    }

    /**
     * Update an existing car
     * PUT/PATCH /api/v1/cars/:carId
     */
    async update(request, response) {
        const {carId} = request.params;
        const payload = request.body;

        if (!carId) {
            throw new BadRequestError("Car ID is required");
        }

        const updatedCar = await CarService.updateCar(carId, payload);

        return new OK({
            message: "Car updated successfully",
            data: updatedCar,
        }).send(response);
    }

    /**
     * Delete a car
     * DELETE /api/v1/cars/:carId
     */
    async delete(request, response) {
        const {carId} = request.params;

        if (!carId) {
            throw new BadRequestError("Car ID is required");
        }

        const result = await CarService.deleteCar(carId);

        return new OK({
            message: "Car deleted successfully",
            data: result,
        }).send(response);
    }
}

module.exports = new CarController();