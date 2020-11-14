const { scheduledJob } = require('./utilities');
const discordListener = require('./listeners');
const { technicalInterviewsChannel, generalChannel } = require('./constants');
const { handleDailyCC } = require('./endpoints/dailyCC');
const { handleAffirmation } = require('./endpoints/affirmations');
const { discordClient } = require('./config');

discordListener();

discordClient.on('ready', () => {
	handleDailyCC();
});
// exports.scheduleDailyCC = scheduledJob(
// 	'0 9 * * *',
// 	handleDailyCC(discordChannels.get(technicalInterviewsChannel))
// );
// exports.scheduleAffirmations = scheduledJob(
// 	'0 9 * * MON',
// 	handleAffirmation(discordChannels.get(generalChannel))
// );
