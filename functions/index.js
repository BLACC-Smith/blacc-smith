const functions = require('firebase-functions');
const { discordClient, discordGuilds } = require('./config');
const { dailyccChannel, affirmationsChannel } = require('./constants');
const { handleDailyCC } = require('./dailyCC');
const postAffirmation = require('./affirmations');
const { askAnonymously, getPreferredChannel, handleAFAF } = require('./afaf');
const { access_token } = functions.config().github;

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

discordClient.on('message', async ({ content, channel, author }) => {
	if (author.bot) return;
	try {
		if (content.toLowerCase().startsWith('feature:')) {
			const newIssue = await handleNewIssue({
				channel,
				issue: content.slice(8).trim(),
				access_token,
			});
			channel.send(newIssue);
		}
	} catch (error) {
		throw { onHandleNewIssue: error };
	}
});
