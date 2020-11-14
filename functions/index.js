var schedule = require('node-schedule');
const functions = require('firebase-functions');
const { scheduledJob } = require('./utilities');
const discordListener = require('./listeners');
const { handleDailyCC } = require('./automations/dailyCC');
const { handleAffirmation } = require('./automations/affirmations');
const { discordClient } = require('./config');

discordListener();

schedule.scheduleJob('0 9 * * MON', () => {
	handleAffirmation();
});
schedule.scheduleJob('0 9 * * *', () => {
	handleDailyCC();
});
