const functions = require('firebase-functions');
const discordListener = require('./listeners');
const { scheduledJob } = require('./utilities');
const endpointHandler = require('./automations');

discordListener();

exports.discord = functions.https.onRequest(endpointHandler);
exports.runDailyCC = scheduledJob('0 9 * * *', 'daily-cc');
exports.runAffirmations = scheduledJob('0 9 * * MON', 'affirmations');
