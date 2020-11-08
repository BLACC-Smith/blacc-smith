const functions = require('firebase-functions');
const { discordClient } = require('./config');
const { dailyccChannel, affirmationsChannel, apiUrl } = require('./constants');
const { handleDailyCC } = require('./endpoints/dailyCC');
const { getAffirmation } = require('./endpoints/affirmations');
const { handleAFAF } = require('./listeners/afaf');
const axios = require('axios');
const { scheduledJob } = require('./utilities');

exports.affirmations = functions.https.onRequest((req, res) => {
	discordClient.on('ready', async () => {
		try {
			const message = await getAffirmation();
			if (!message) {
				res.send('Cannot retrieve data');
				return;
			}
			discordClient.channels.cache.get(affirmationsChannel).send(message);
			res.send(message);
		} catch (error) {
			res.send({ err });
		}
	});
});

exports.dailycc = functions.https.onRequest((req, res) => {
	discordClient.on('ready', async () => {
		try {
			const question = await handleDailyCC();
			if (!question) {
				res.send('Cannot retrieve data');
				return;
			}
			discordClient.channels.cache
				.get(dailyccChannel)
				.send(question)
				.then((msg) => {
					msg.pin();
					res.send(question);
				});
		} catch (err) {
			res.send({ err });
		}
	});
});

exports.scheduleDailyCC = scheduledJob('* * * * *', 'dailycc');
exports.scheduleAffirmations = scheduledJob('0 9 * * MON', 'affirmations');

discordClient.on('message', async (message) => {
	try {
		await handleAFAF(message);
	} catch (error) {
		throw 'Error occured while asking for a friend';
	}
});
