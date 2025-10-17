"use strict";

const UserModel = require("../models/user.model");
const CognitoService = require("./cognito.service");
const { BadRequestError, AuthFailureError, NotFoundError } = require("../core/error.response");

class AuthService {
  async signup({ username, password, email, role = "user" }) {
    try {
      // Validate input
      if (!username || !password || !email) {
        throw new BadRequestError("Username, password, and email are required");
      }

      // Validate role
      const validRoles = ["user", "admin", "staff"];
      if (!validRoles.includes(role)) {
        throw new BadRequestError(
          `Invalid role. Must be one of: ${validRoles.join(", ")}`
        );
      }

      // Check if user already exists in local database
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        throw new BadRequestError("Username already exists");
      }

      // Register user in Cognito (includes adding to group)
      const cognitoResult = await CognitoService.signUp({
        username,
        password,
        email,
        role,
      });

      // Save user to local database
      const newUser = await UserModel.create({
        username,
        email,
        role,
        cognitoSub: cognitoResult.userSub,
        emailVerified: cognitoResult.userConfirmed,
      });

      // Auto-confirm user in development
      if (process.env.NODE_ENV === "dev") {
        await CognitoService.autoConfirmUser(username);
        newUser.emailVerified = true;
        await newUser.save();
      }

      return {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          cognitoSub: cognitoResult.userSub,
          emailVerified: newUser.emailVerified,
        },
        message: cognitoResult.message,
      };
    } catch (error) {
      if (error.message?.includes("duplicate key") || error.code === 11000) {
        throw new BadRequestError("Username or email already exists");
      }
      throw error;
    }
  }

  async login({ username, password }) {
    try {
      if (!username || !password) {
        throw new BadRequestError("Username and password are required");
      }

      const cognitoResult = await CognitoService.login({ username, password });

      let localUser = await UserModel.findOne({ username });

      if (!localUser) {
        localUser = await UserModel.create({
          username: cognitoResult.user.username,
          email: cognitoResult.user.email,
          role: cognitoResult.user.role,
          cognitoSub: cognitoResult.user.username,
          emailVerified: cognitoResult.user.emailVerified,
        });
      }

      localUser.lastLogin = new Date();
      await localUser.save();

      return {
        tokens: {
          accessToken: cognitoResult.accessToken,
          idToken: cognitoResult.idToken,
          refreshToken: cognitoResult.refreshToken,
          expiresIn: cognitoResult.expiresIn,
          tokenType: cognitoResult.tokenType,
        },
        user: {
          id: localUser._id,
          username: localUser.username,
          email: localUser.email,
          role: cognitoResult.user.role,
          groups: cognitoResult.user.groups,
          emailVerified: cognitoResult.user.emailVerified,
        },
      };
    } catch (error) {
      if (error.name === "NotAuthorizedException") {
        throw new AuthFailureError("Invalid username or password");
      }
      if (error.name === "UserNotConfirmedException") {
        throw new AuthFailureError(
          "Please verify your email before logging in"
        );
      }
      throw error;
    }
  }

  async getUserProfile(username) {
    try {
      const cognitoUser = await CognitoService.getUserDetails(username);
      const localUser = await UserModel.findOne({ username });

      if (!localUser) {
        throw new NotFoundError("User not found in database");
      }

      return {
        username: cognitoUser.username,
        email: cognitoUser.email,
        role: cognitoUser.primaryRole,
        groups: cognitoUser.groups,
        emailVerified: cognitoUser.emailVerified,
        userStatus: cognitoUser.userStatus,
        localData: {
          id: localUser._id,
          createdAt: localUser.createdAt,
          lastLogin: localUser.lastLogin,
          isActive: localUser.isActive,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(username, newRole) {
    try {
      // Validate role
      const validRoles = ["user", "admin", "staff"];
      if (!validRoles.includes(newRole)) {
        throw new BadRequestError(
          `Invalid role. Must be one of: ${validRoles.join(", ")}`
        );
      }

      const cognitoResult = await CognitoService.updateUserRole(
        username,
        newRole
      );

      const localUser = await UserModel.findOneAndUpdate(
        { username },
        { role: newRole },
        { new: true }
      );

      if (!localUser) {
        throw new NotFoundError("User not found in database");
      }

      return {
        message: cognitoResult.message,
        user: {
          id: localUser._id,
          username: localUser.username,
          email: localUser.email,
          role: localUser.role,
        },
        previousGroups: cognitoResult.previousGroups,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();