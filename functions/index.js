const { scheduledJob } = require('./utilities');
const discordListener = require('./listeners');
const { handleDailyCC } = require('./automations/dailyCC');
const { handleAffirmation } = require('./automations/affirmations');

discordListener();

exports.scheduleDailyCC = scheduledJob('0 9 * * *', handleDailyCC);
exports.scheduleAffirmations = scheduledJob('0 9 * * MON', handleAffirmation);
