"use strict";

// Gọn nhẹ: chỉ giữ các thao tác thực dùng cho app
const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AdminConfirmSignUpCommand,
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  AdminRemoveUserFromGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const crypto = require("crypto");

class CognitoService {
  constructor() {
    this.client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    const rawClientId = process.env.AWS_COGNITO_CLIENT_ID;
    this.clientId = typeof rawClientId === "string" ? rawClientId.trim() || undefined : rawClientId;
    this.clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET;

    this.availableGroups = ["user", "admin", "staff"];
    this.tokenVerifiers = this.initializeTokenVerifiers();
  }

  generateSecretHash(username) {
    if (!this.clientSecret) return undefined;

    return crypto
      .createHmac("SHA256", this.clientSecret)
      .update(username + this.clientId)
      .digest("base64");
  }

  initializeTokenVerifiers() {
    if (!this.userPoolId) {
      return null;
    }

    const verifiers = {};

    const verifierClientId = typeof this.clientId === "string" ? this.clientId.trim() : this.clientId;

    if (verifierClientId) {
      verifiers.id = CognitoJwtVerifier.create({
        userPoolId: this.userPoolId,
        tokenUse: "id",
        clientId: verifierClientId,
      });
    }

    verifiers.access = CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: "access",
      clientId: null,
    });

    return verifiers;
  }

  async decodeToken(token) {
    if (!token) {
      throw new Error("Authorization token is required");
    }

    if (!this.tokenVerifiers) {
      throw new Error("Cognito token verifiers are not configured");
    }

    const attempts = [
      { use: "id", verifier: this.tokenVerifiers.id },
      { use: "access", verifier: this.tokenVerifiers.access },
    ];

    let lastError = null;

    for (const attempt of attempts) {
      if (!attempt.verifier) continue;

      try {
        const payload = await attempt.verifier.verify(token);
        return { payload, tokenUse: attempt.use };
      } catch (error) {
        lastError = error;
      }
    }

    const err = new Error("Invalid or expired token");
    err.cause = lastError;
    throw err;
  }

  async signUp({ username, password, email, role = "user" }) {
    if (!this.availableGroups.includes(role)) {
      throw new Error(
        `Invalid role. Must be one of: ${this.availableGroups.join(", ")}`
      );
    }

    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) {
      params.SecretHash = secretHash;
    }

    try {
      const command = new SignUpCommand(params);
      const response = await this.client.send(command);
      await this.addUserToGroup(username, role);

      return {
        userSub: response.UserSub,
        username: username,
        email: email,
        role: role,
        userConfirmed: response.UserConfirmed,
        message: "User registered successfully. Please verify your email.",
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async addUserToGroup(username, groupName) {
    try {
      const command = new AdminAddUserToGroupCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        GroupName: groupName,
      });

      await this.client.send(command);
      return { message: `User added to group: ${groupName}` };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async removeUserFromGroup(username, groupName) {
    try {
      const command = new AdminRemoveUserFromGroupCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        GroupName: groupName,
      });

      await this.client.send(command);
      return { message: `User removed from group: ${groupName}` };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async getUserGroups(username) {
    try {
      const command = new AdminListGroupsForUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      const response = await this.client.send(command);
      return response.Groups || [];
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async autoConfirmUser(username) {
    try {
      const command = new AdminConfirmSignUpCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      await this.client.send(command);
      return { message: "User confirmed successfully" };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async login({ username, password }) {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const secretHash = this.generateSecretHash(username);
    if (secretHash) {
      params.AuthParameters.SECRET_HASH = secretHash;
    }

    try {
      const command = new InitiateAuthCommand(params);
      const response = await this.client.send(command);

      if (!response.AuthenticationResult) throw new Error("Authentication failed");
      const userDetails = await this.getUserDetails(username);

      return {
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
        tokenType: response.AuthenticationResult.TokenType,
        user: {
          username: username,
          email: userDetails.email,
          groups: userDetails.groups,
          role: userDetails.primaryRole,
          emailVerified: userDetails.emailVerified,
        },
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async getUserDetails(username) {
    try {
      const userCommand = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      const userResponse = await this.client.send(userCommand);
      const groups = await this.getUserGroups(username);

      const attributes = userResponse.UserAttributes.reduce((acc, attr) => {
        acc[attr.Name.replace("custom:", "")] = attr.Value;
        return acc;
      }, {});

      let primaryRole = "user";
      if (groups.length > 0) primaryRole = groups.sort((a, b) => a.Precedence - b.Precedence)[0].GroupName;

      return {
        username: userResponse.Username,
        email: attributes.email,
        groups: groups.map((g) => g.GroupName),
        primaryRole: primaryRole,
        emailVerified: attributes.email_verified === "true",
        userStatus: userResponse.UserStatus,
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  async updateUserRole(username, newRole) {
    if (!this.availableGroups.includes(newRole)) {
      throw new Error(
        `Invalid role. Must be one of: ${this.availableGroups.join(", ")}`
      );
    }

    try {
      const currentGroups = await this.getUserGroups(username);
      for (const group of currentGroups) await this.removeUserFromGroup(username, group.GroupName);
      await this.addUserToGroup(username, newRole);

      return {
        message: "User role updated successfully",
        username: username,
        newRole: newRole,
        previousGroups: currentGroups.map((g) => g.GroupName),
      };
    } catch (error) {
      throw this.handleCognitoError(error);
    }
  }

  handleCognitoError(error) {
    const errorMap = {
      UsernameExistsException: "Username already exists",
      InvalidPasswordException: "Password does not meet requirements",
      InvalidParameterException: "Invalid parameters provided",
      NotAuthorizedException: "Invalid username or password",
      UserNotFoundException: "User not found",
      UserNotConfirmedException: "User email not verified",
      TooManyRequestsException: "Too many requests, please try again later",
      CodeMismatchException: "Invalid verification code",
      ExpiredCodeException: "Verification code has expired",
      ResourceNotFoundException: "Group not found",
    };

    const message = errorMap[error.name] || error.message || "Authentication error";

    const customError = new Error(message);
    customError.name = error.name;
    customError.statusCode = error.$metadata?.httpStatusCode || 400;

    return customError;
  }
}

module.exports = new CognitoService();
