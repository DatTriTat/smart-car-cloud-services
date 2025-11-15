// "use strict"
//
// const {Server} = require("socket.io");
// const logger = require("../utils/logger");
//
// let io;
//
// function initSocket(httpServer) {
//     io = new Server(httpServer, {
//         cors: {
//             origin: process.env.CORS_ORIGIN || "*",
//             methods: ["GET", "POST"],
//         },
//     });
//
//     io.use((socket, next) => {
//         const userId = socket.handshake.auth.userId;
//         if (!userId) {
//             return next(new Error("Not authenticated"));
//         }
//         socket.userId = userId;
//         next();
//     });
//
//     io.on("connection", socket => {
//         logger.info(`Socket connected: ${socket.id} for user ${socket.userId}`);
//         socket.join(socket.userId);
//         socket.on("disconnect", () => {
//             logger.info(`Socket disconnected: ${socket.id}`);
//         });
//     });
//
//     logger.info("Socket.IO started");
//     return io;
// }
//
// function getIO() {
//     if (!io) {
//         throw new Error("Socket.IO not initialized");
//     }
//     return io;
// }
//
// module.exports = {
//     initSocket,
//     getIO,
// };