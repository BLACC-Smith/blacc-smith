const functions = require("firebase-functions");
const Discord = require("discord.js");
const axios = require("axios");
const admin = require("firebase-admin");
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});
const slugs = require("./constants");

exports.dailycc = functions.https.onRequest(() => {
	const client = new Discord.Client();
	const { access_token } = functions.config().discord;

	client.login(access_token).catch((err) => console.log(err));

	client.on("ready", () => {
		const slug = slugs[Math.round(Math.random() * slugs.length - 1)];
		postQuestion(slug, client.channels.cache.get("771821709589479505"));
	});

	const postQuestion = async (slug, channel) => {
		const result = await getQuestion(slug);

		if (result === "Not Found") {
			channel.send(`No coding problem today. Check back tomorrow 😁`);
			return;
		} else {
			channel.send(result).catch((err) => {
				channel.send("There was an issue grabbing the question");
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

exports.affirmations = functions.https.onRequest((request, response) => {
	const client = new Discord.Client();
	const { access_token } = functions.config().discord;

	client.login(access_token).catch((err) => console.log(err));

	client.on("ready", async () => {
		postAffirmation(client.channels.cache.get("771821709589479505"));
	});

	const postAffirmation = async (channel) => {
		var affirmation = [];
		const result = await getAffirmation((data) => {
			affirmation = data;
		});

		if (
			affirmation === null ||
			affirmation === undefined ||
			affirmation.length === 0
		) {
			channel.send(`Cheers to a new week 😁`);
		} else {
			channel.send(affirmation).catch((err) => {
				channel.send("There was an issue grabbing the affirmation");
				channel.send(`Error: ${err.message}`);
			});
		}	
	};

	const getAffirmation = async (callback) => {
		try {
			return await admin
				.firestore()
				.collection("constants")
				.doc("affirmations")
				.get()
				.then((res) => {
					if(callback) callback(res.data())
					response.send(res.data());
				})
				.catch((err) => res.send(err));
		} catch ({ response }) {
			console.log("error!");
			console.log({ response });
			return response;
		}
	};
});
