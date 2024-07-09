// pusherClient.js
const Pusher = require('pusher-js');
// Enable logging for Pusher (optional, for debugging purposes)
Pusher.logToConsole = true;
const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true,
});
module.exports = pusher;