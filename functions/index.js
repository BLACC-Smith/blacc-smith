const functions = require('firebase-functions');
const Discord = require('discord.js');
const { handleDailyCC } = require("./dailyCC")
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

exports.dailycc = functions.https.onRequest(async (req, res) => {
	const discordClient = new Discord.Client();
	const { access_token } = functions.config().discord;
	const firestore = admin.firestore();

	discordClient.login(access_token).catch((err) => console.log(err));

	discordClient.on('ready', async () => {
		const channelId = "771821709589479505"
		const channel = discordClient.channels.cache.get(channelId);

		let question
		try{
			question = await handleDailyCC({channel, firestore})
		}
		catch(err){
			console.log('ERROR', err)
			res.send(err)
			return
		}
		console.log('POSTED: ' + question)
		res.send(question)
	});
});
