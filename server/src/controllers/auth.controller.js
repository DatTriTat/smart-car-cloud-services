"use strict";

const AuthService = require("../services/auth.service");
const { OK, CREATED } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class AuthController {
  /**
   * User signup
   * Public endpoint - no authentication required
   */
  async signup(request, response) {
    const { username, password, email, role } = request.body;

    // Validate required fields
    if (!username || !password || !email) {
      throw new BadRequestError("Username, password, and email are required");
    }

    const result = await AuthService.signup({
      username,
      password,
      email,
      role: role || "user",
    });

    return new CREATED({
      message: result.message || "User created successfully",
      data: result.user,
    }).send(response);
  }

  /**
   * User login
   * Public endpoint - no authentication required
   */
  async login(request, response) {
    const { username, password } = request.body;

    // Validate required fields
    if (!username || !password) {
      throw new BadRequestError("Username and password are required");
    }

    const result = await AuthService.login({ username, password });

    return new OK({
      message: "Login successful",
      data: result,
    }).send(response);
  }

  /**
   * Get user profile
   * Protected endpoint - requires authentication
   * API Gateway ensures user is authenticated
   * No role check needed - any authenticated user can access
   */
  async getProfile(request, response) {
    const { username } = request.params;

    const result = await AuthService.getUserProfile(username);

    return new OK({
      message: "Profile retrieved successfully",
      data: result,
    }).send(response);
  }

  /**
   * Update user role
   * Protected endpoint - requires authentication
   * API Gateway ensures ONLY ADMINS can access this endpoint
   * No role check needed in backend!
   */
  async updateRole(request, response) {
    const { username } = request.params;
    const { role } = request.body;
    if (!role) {
      throw new BadRequestError("Role is required");
    }

    const result = await AuthService.updateUserRole(username, role);

    return new OK({
      message: result.message,
      data: result.user,
    }).send(response);
  }
}

module.exports = new AuthController();