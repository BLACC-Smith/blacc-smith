const functions = require('firebase-functions');
const Discord = require('discord.js');
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();
const slugs = require('./constants');

exports.dailycc = functions.https.onRequest(() => {
	const client = new Discord.Client();
	const { access_token } = functions.config().discord;

	client.login(access_token).catch((err) => console.log(err));

	client.on('ready', () => {
		const slug = slugs[Math.round(Math.random() * slugs.length - 1)];
		postQuestion(slug, client.channels.cache.get('771821709589479505'));
	});

	const postQuestion = async (slug, channel) => {
		const result = await getQuestion(slug);

		if (result === 'Not Found') {
			channel.send(`No coding problem today. Check back tomorrow 😁`);
			return;
		} else {
			channel.send(result).catch((err) => {
				channel.send('There was an issue grabbing the question');
				channel.send(`Error: ${err.message}`);
			});
		}
	};

	const getQuestion = async (slug) => {
		try {
			const { data } = await axios.get(
				`https://www.codewars.com/api/v1/code-challenges/${slug}`
			);
			return data.url;
		} catch ({ response }) {
			return response.statusText;
		}
	};
});
