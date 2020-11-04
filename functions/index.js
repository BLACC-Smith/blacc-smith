const functions = require('firebase-functions');
const axios = require('axios');
const { firestore, discordClient } = require('./config');
const { testChannel } = require('./constants');
const postAffirmation = require('./affirmations');

exports.dailycc = functions.https.onRequest(async (req, res) => {
	console.log({ testChannel });
	firestore
		.collection('dailyCC')
		.doc('gt-test')
		.set({ status: 'Success' })
		.then(() => {
			discordClient.channels.cache.get(testChannel).send('Config file works');
			res.send('Hit firestore successfully');
		});
	// const client = new Discord.Client();
	// const { access_token } = functions.config().discord;
	// client.login(access_token).catch((err) => console.log(err));
	// client.on("ready", () => {
	// 	const slug = slugs[Math.round(Math.random() * slugs.length - 1)];
	// 	postQuestion(slug, client.channels.cache.get("771821709589479505"));
	// });
	// const postQuestion = async (slug, channel) => {
	// 	const result = await getQuestion(slug);
	// 	if (result === "Not Found") {
	// 		channel.send(`No coding problem today. Check back tomorrow 😁`);
	// 		return;
	// 	} else {
	// 		channel.send(result).catch((err) => {
	// 			channel.send("There was an issue grabbing the question");
	// 			channel.send(`Error: ${err.message}`);
	// 		});
	// 	}
	// };
	// const getQuestion = async (slug) => {
	// 	try {
	// 		const { data } = await axios.get(
	// 			`https://www.codewars.com/api/v1/code-challenges/${slug}`
	// 		);
	// 		return data.url;
	// 	} catch ({ response }) {
	// 		return response.statusText;
	// 	}
	// };
});

exports.affirmations = functions.https.onRequest((req, res) => {
	discordClient.on('ready', async () => {
		try {
			const quote = await postAffirmation();
			if (quote) {
				discordClient.channels.cache.get(testChannel).send(quote);
				res.send(quote);
			} else res.send('Cannot retrieve data');
		} catch (error) {
			throw error;
		}
	});
});
