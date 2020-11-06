const functions = require('firebase-functions');
const { handleDailyCC } = require('./dailyCC');
const { discordClient } = require('./config');
const { dailyccChannel, affirmationsChannel } = require('./constants');
const postAffirmation = require('./affirmations');

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
			const quote = await postAffirmation();
			if (quote) {
				discordClient.channels.cache.get(affirmationsChannel).send(quote);
				res.send(quote);
			} else res.send('Cannot retrieve data');
		} catch (error) {
			throw error;
		}
		console.log('POSTED: ' + question);
		res.send(question);
	});
});
