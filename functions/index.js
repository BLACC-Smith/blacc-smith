const functions = require('firebase-functions');
const discordListener = require('./listeners');
const { scheduledJob } = require('./utilities');
const endpointHandler = require('./automations');
const { default: axios } = require('axios');
const { apiUrl } = require('./constants');

/**
 * @description The discordListener listens to different messages
 * from the BLACC server and handles DMs and regular
 * messages differently.
 */
discordListener();

exports.discord = functions.https.onRequest(endpointHandler);
exports.runDailyCC = scheduledJob('0 9 * * *', 'daily-cc');
exports.runAffirmations = scheduledJob('0 9 * * MON', 'affirmations');
exports.youtubeSubmissions = functions.storage
	.object()
	.onFinalize(async (object) => {
		try {
			const { data } = await axios.get(`${apiUrl}/youtube-submission`);
			console.log({ data });
		} catch (error) {
			throw { youtubeSubmissions: error };
		}
	});
