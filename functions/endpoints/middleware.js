const functions = require('firebase-functions');
const Discord = require('discord.js');

const discordLoginMiddleware = (req, res, next)=>{
	const discordClient = new Discord.Client();
	const { access_token } = functions.config().discord;

	discordClient.login(access_token).catch((err) => {
		console.log(err)
		res.status(500).send({
			error: err.toString(),
		})
	});

	discordClient.on('ready', async () => {
		req.discordClient = discordClient
		req.discordGuilds = discordClient.guilds.cache;
	  next()
	});
}

exports.discordLoginMiddleware = discordLoginMiddleware;
