const functions = require('firebase-functions');
const discordListener = require('./listeners');
const { handleDailyCC } = require('./automations/dailyCC');
const { handleAffirmation } = require('./automations/affirmations');
const { jobScheduler } = require('./utilities');
const endpointHandler = require('./automations');

discordListener();

exports.discord = functions.https.onRequest(endpointHandler);

// jobScheduler('0 9 * * MON', handleAffirmation);
// jobScheduler('* * * * *', handleDailyCC);
