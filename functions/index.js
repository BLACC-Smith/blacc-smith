const functions = require('firebase-functions');
const discordListener = require('./listeners');
const { scheduledJob } = require('./utilities');
const endpointHandler = require('./automations');
const { storageHandler } = require('./automations/youtubeSubmissions');

/**
 * @description The discordListener listens to different messages
 * from the BLACC server and handles DMs and regular
 * messages differently.
 */
discordListener();

exports.discord = functions.https.onRequest(endpointHandler);
exports.runDailyCC = scheduledJob('0 9 * * *', 'daily-cc');
exports.runAffirmations = scheduledJob('0 9 * * MON', 'affirmations');
exports.youtubeSubmissions = storageHandler();
