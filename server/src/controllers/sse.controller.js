"use strict"

const {BadRequestError} = require("../core/error.response");
const {addClient, removeClient, pushToUser} = require("../services/sse.service");
const {CREATED} = require("../core/success.response");

class SSEController {

    async connect(req, res) {
        const userId = req.query.userId || "";
        if (!userId) {
            throw new BadRequestError("userId is required");
        }

        // SSE headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        // Helpful for some proxies (e.g., Nginx) to disable response buffering
        res.setHeader("X-Accel-Buffering", "no");

        // Send an initial comment line to open the stream immediately
        res.write(`: connected ${Date.now()}\n\n`);

        addClient(userId, res);

        // Heartbeat every 25s to keep the connection alive through proxies/LBs
        const hb = setInterval(() => {
            res.write(`: heartbeat ${Date.now()}\n\n`);
        }, 25_000);

        // Clean up on client disconnect
        req.on("close", () => {
            clearInterval(hb);
            removeClient(userId, res);
            res.end();
        });
    }

    // async test(req, res) {
    //     const {userId, data} = req.body || {};
    //
    //
    //     const notification = {
    //         id: String(Date.now()),
    //         title: data.title || "New notification",
    //         body: data || "",
    //         ts: Date.now(),
    //     };
    //
    //     pushToUser(String(userId), notification);
    //     return new CREATED({
    //         message: "Notification created",
    //         data: notification,
    //     }).send(res);
    // }
}

module.exports = new SSEController();