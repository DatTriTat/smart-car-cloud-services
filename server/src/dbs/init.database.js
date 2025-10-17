"use strict";

const { Sequelize } = require("sequelize");
const config = require("../config/database");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {},
  }
);

// Database connection class
class Database {
  constructor() {
    this.sequelize = sequelize;
  }

  async connect() {
    try {
      // Test connection
      await this.sequelize.authenticate();
      console.log("✓ PostgreSQL connection established successfully");

      // Sync models in development (auto-create tables)
      if (env === "development") {
        await this.sequelize.sync({ alter: false });
        console.log("✓ Database synced");
      }

      return this.sequelize;
    } catch (error) {
      console.error("✗ Unable to connect to PostgreSQL:", error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.sequelize.close();
      console.log("✓ PostgreSQL connection closed");
    } catch (error) {
      console.error("✗ Error closing PostgreSQL connection:", error);
      throw error;
    }
  }

  getSequelize() {
    return this.sequelize;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceDatabase = Database.getInstance();

module.exports = instanceDatabase;