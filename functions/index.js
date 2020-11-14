var schedule = require('node-schedule');
const discordListener = require('./listeners');
const { handleDailyCC } = require('./automations/dailyCC');
const { handleAffirmation } = require('./automations/affirmations');

discordListener();

schedule.scheduleJob('0 9 * * MON', () => {
	handleAffirmation();
});
schedule.scheduleJob('0 9 * * *', () => {
	handleDailyCC();
});
