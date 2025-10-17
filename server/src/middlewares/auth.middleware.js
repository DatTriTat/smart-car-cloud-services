"use strict";

const extractUser = (req, res, next) => {
  try {
    const username = req.headers["x-cognito-username"];
    const email = req.headers["x-cognito-email"];
    const sub = req.headers["x-cognito-sub"];
    const groupsHeader = req.headers["x-cognito-groups"];
    
    // If no username, request didn't come through API Gateway properly
    if (!username) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Authentication required"
      });
    }
    
    // Parse groups (API Gateway sends as comma-separated string)
    const groups = groupsHeader ? groupsHeader.split(",").map(g => g.trim()) : [];
    
    let primaryRole = "user";
    if (groups.includes("admin")) {
      primaryRole = "admin";
    } else if (groups.includes("staff")) {
      primaryRole = "staff";
    }
    
    // Attach user info to request
    // Available in all route handlers as req.user
    req.user = {
      username,
      email,
      sub,
      groups,          
      role: primaryRole
    };
    
    next();
  } catch (error) {
    console.error("Error extracting user:", error);
    return res.status(500).json({
      status: "Error",
      code: 500,
      message: "Failed to process authentication"
    });
  }
};

/**
 * For local development without API Gateway
 * Decodes JWT token to extract user info
 * WARNING: Only use in development! No verification!
 */
const extractUserLocal = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Error",
        code: 401,
        message: "Authorization token required"
      });
    }
    
    const token = authHeader.split(" ")[1];
    
    // Decode JWT (no verification - for dev only!)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString()
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    const decoded = JSON.parse(jsonPayload);
    
    // Extract groups from token
    const groups = decoded["cognito:groups"] || [];
    
    // Determine primary role
    let primaryRole = "user";
    if (groups.includes("admin")) {
      primaryRole = "admin";
    } else if (groups.includes("staff")) {
      primaryRole = "staff";
    }
    
    // Attach user info to request
    req.user = {
      username: decoded["cognito:username"] || decoded.username,
      email: decoded.email,
      sub: decoded.sub,
      groups,
      role: primaryRole
    };
    
    next();
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(401).json({
      status: "Error",
      code: 401,
      message: "Invalid token"
    });
  }
};

/**
 * Main authentication middleware
 * Auto-detects if behind API Gateway or local development
 */
const authenticate = (req, res, next) => {
  // Check if request came through API Gateway
  const isAPIGateway = req.headers["x-cognito-username"] || 
                       req.headers["x-apigateway-event"] ||
                       req.headers["x-amzn-requestid"];
  
  if (isAPIGateway) {
    // Production: Extract from API Gateway headers
    return extractUser(req, res, next);
  } else {
    // Local development: Decode from JWT token
    console.warn("⚠️  Running in local mode - no API Gateway verification!");
    return extractUserLocal(req, res, next);
  }
};

/**
 * Optional: Log user info (for debugging)
 */
const logUser = (req, res, next) => {
  if (req.user) {
    console.log("Authenticated user:", {
      username: req.user.username,
      role: req.user.role,
      groups: req.user.groups
    });
  }
  next();
};

module.exports = {
  authenticate,
  extractUser,
  extractUserLocal,
  logUser
};