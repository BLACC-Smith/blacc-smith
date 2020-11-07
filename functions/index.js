const functions = require('firebase-functions');
const { discordClient } = require('./config');
const { affirmationsChannel } = require('./constants');
const postAffirmation = require('./affirmations');
const { handleNewRequest } = require('./githubRequests');

exports.dailycc = functions.https.onRequest(async (req, res) => {
	const discordClient = new Discord.Client();
	const { access_token } = functions.config().discord;
	const firestore = admin.firestore();

	discordClient.login(access_token).catch((err) => console.log(err));

	discordClient.on('ready', async () => {
		const channelId = '771821709589479505';
		const channel = discordClient.channels.cache.get(channelId);

		let question;
		try {
			question = await handleDailyCC({ channel, firestore });
		} catch (err) {
			console.log('ERROR', err);
			res.send(err);
			return;
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
		console.log('POSTED: ' + question);
		res.send(question);
	});
});

discordClient.on('message', ({ content, channel, author }) => {
	if (author.bot) return;
	if (content.startsWith('Feature:')) {
		const res = handleNewRequest(content.split('Feature:')[1].trim());
		channel.send(res);
	}
});
