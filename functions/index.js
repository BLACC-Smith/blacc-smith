const functions = require('firebase-functions');
const {scheduledJob} = require('./utilities');
const endpointHandler = require('./endpoints');
const discordListener = require('./listeners');

discordListener()

exports.discord = functions.https.onRequest(endpointHandler);
exports.scheduleDailyCC = scheduledJob('0 9 * * *', 'daily-cc');
exports.scheduleAffirmations = scheduledJob('0 9 * * MON', 'affirmations');
