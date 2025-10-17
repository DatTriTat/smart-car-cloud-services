"use strict";

const express = require("express");
const AuthController = require("../../controllers/auth.controller");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * User signup
 * API Gateway: No authorization
 */
router.post("/signup", asyncErrorHandler(AuthController.signup));

/**
 * User login
 * API Gateway: No authorization
 */
router.post("/login", asyncErrorHandler(AuthController.login));

/**
 * Get user profile
 * API Gateway: Authorization required (any authenticated user)
 * Authorization Scopes: (leave empty or all groups)
 */
router.get(
  "/profile/:username",
  authenticate, 
  asyncErrorHandler(AuthController.getProfile)
);

/**
 * Update user role
 * API Gateway: Authorization required (admin only)
 * Authorization Scopes: admin
 */
router.patch(
  "/role/:username",
  authenticate, // Only extracts user info - no authorization check!
  asyncErrorHandler(AuthController.updateRole)
);



module.exports = router;