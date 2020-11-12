const functions = require('firebase-functions');
const Discord = require('discord.js');

const discordLoginMiddleware = (req, res, next) => {
	const discordClient = new Discord.Client();

	discordClient.login(process.env.DISCORD_ACCESS_TOKEN).catch((err) => {
		console.log(err);
		res.status(500).send({
			error: err.toString(),
		});
	});

	discordClient.on('ready', async () => {
		req.discordClient = discordClient;
		req.discordGuilds = discordClient.guilds.cache;
		req.discordChannels = discordClient.channels.cache;
		next();
	});
};

exports.discordLoginMiddleware = discordLoginMiddleware;
