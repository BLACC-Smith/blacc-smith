const functions = require('firebase-functions');
const { discordClient } = require('./config');
const { dailyccChannel, affirmationsChannel } = require('./constants');
const { handleDailyCC } = require('./endpoints/dailyCC');
const { postAffirmation } = require('./endpoints/affirmations');
const { handleAFAF } = require('./listeners/afaf');

exports.affirmations = functions.pubsub
	.schedule('0 9 * * MON')
	.timeZone('US/Central')
	.onRun(() => {
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

exports.dailycc = functions.pubsub
	.schedule('0 9 * * *')
	.timeZone('US/Central')
	.onRun(() => {
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

discordClient.on('message', async (message) => {
	try {
		await handleAFAF(message);
	} catch (error) {
		throw 'Error occured while asking for a friend';
	}
});
