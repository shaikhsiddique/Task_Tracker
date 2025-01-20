const fbAdmin = require('firebase-admin');
const serviceCredentials = require('../ecommerce-ab165-firebase-adminsdk-y4bcm-b53ce9ae6e.json');

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceCredentials),
    storageBucket: process.env.FIRE_BASE
});

const bucket = fbAdmin.storage().bucket();

module.exports = { bucket };
