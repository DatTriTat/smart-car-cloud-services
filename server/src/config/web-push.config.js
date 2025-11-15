const webPush = require('web-push');

const PUB = process.env.VAPID_PUBLIC_KEY;
const PRIV = process.env.VAPID_PRIVATE_KEY;
const CONTACT = process.env.VAPID_CONTACT || 'mailto:admin@example.com';

if (!PUB || !PRIV) {
    throw new Error('VAPID keys missing. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env');
}

webPush.setVapidDetails(CONTACT, PUB, PRIV);

module.exports = {
    webPush,
    publicKey: PUB,
};
