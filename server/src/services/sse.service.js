"use strict"

const clients = new Map();

function addClient(userId, res) {
    let set = clients.get(userId);
    if (!set) {
        set = new Set();
        clients.set(userId, set);
    }
    set.add(res);
}

function removeClient(userId, res) {
    const set = clients.get(userId);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) clients.delete(userId);
}

function sendSse(res, event, data) {
    if (event) res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/** Public helper to push to a user (all their tabs) */
function pushToUser(userId, payload) {
    const set = clients.get(String(userId));
    if (!set) return;
    for (const res of set) sendSse(res, "notification", payload);
}


module.exports = {
    addClient,
    removeClient,
    pushToUser,
};
