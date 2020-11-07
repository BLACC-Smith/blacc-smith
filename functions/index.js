const functions = require('firebase-functions');
const { discordClient, discordGuilds } = require('./config');
const { dailyccChannel, affirmationsChannel } = require('./constants');
const { handleDailyCC } = require('./dailyCC');
const postAffirmation = require('./affirmations');
const { askAnonymously, getPreferredChannel, handleAFAF } = require('./afaf');

exports.dailycc = functions.https.onRequest(async (req, res) => {
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
			console.log({ err });
			res.send({ err });
		}
	});
});
exports.affirmations = functions.https.onRequest((req, res) => {
	discordClient.on('ready', async () => {
		try {
			const message = await postAffirmation();
			if (!message) {
				res.send('Cannot retrieve data');
				return;
			}
			discordClient.channels.cache.get(affirmationsChannel).send(message);
			res.send(message);
		} catch (error) {
			throw error;
		}
	});
});

discordClient.on('message', async (message) => {
	try {
		await handleAFAF(message);
	} catch (error) {
		throw 'Error occured while asking for a friend';
	}
});
