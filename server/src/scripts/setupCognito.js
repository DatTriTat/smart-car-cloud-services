"use strict";

require("dotenv").config();
const CognitoService = require("../services/cognito.service");

async function setupCognitoGroups() {
  console.log("Starting Cognito Groups Setup...\n");

  try {
    console.log("Checking environment variables...");
    const requiredVars = [
      "AWS_REGION",
      "AWS_COGNITO_USER_POOL_ID",
      "AWS_COGNITO_CLIENT_ID",
    ];

    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }

    console.log("Environment variables verified.\n");

    // Initialize groups
    console.log("Creating Cognito Groups...");
    const result = await CognitoService.initializeGroups();

    if (result.created.length > 0) {
      console.log("\nCreated groups:", result.created.join(", "));
    }

    if (result.existing.length > 0) {
      console.log("Already exists:", result.existing.join(", "));
    }

    // List all groups
    console.log("\nAvailable groups:");
    const groups = await CognitoService.listGroups();

    groups.forEach((group) => {
      console.log(` - ${group.GroupName} (Precedence: ${group.Precedence})`);
      console.log(`   ${group.Description}`);
    });

    console.log("\nCognito setup completed successfully!");
    console.log("\nYou can now signup users with roles:");
    console.log(" - user   (regular users)");
    console.log(" - staff  (staff members)");
    console.log(" - admin  (administrators)");
    console.log("\nNext steps:");
    console.log("  1. Configure API Gateway authorization");
    console.log("  2. Set authorization scopes for each route");
    console.log("  3. Test with different user roles");
  } catch (error) {
    console.error("\nSetup failed:", error.message);
    console.error("\nDetails:", error);
    console.error("\nMake sure:");
    console.error(" - AWS credentials are configured");
    console.error(" - .env file exists with correct values");
    console.error(" - User Pool ID and Client ID are correct");
    process.exit(1);
  }
}

// Run setup
setupCognitoGroups()
  .then(() => {
    console.log("\nSetup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nUnexpected error:", error);
    process.exit(1);
  });
