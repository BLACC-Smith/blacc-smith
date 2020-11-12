const functions = require('firebase-functions');
const Discord = require('discord.js');

// DISCORD CLIENT
const discordClient = new Discord.Client();
discordClient
	.login(process.env.DISCORD_ACCESS_TOKEN)
	.catch((err) => console.log(err));

exports.discordClient = discordClient;
exports.discordGuilds = discordClient.guilds.cache;
exports.discordChannels = discordClient.channels.cache;
exports.discordMessageEmbed = new Discord.MessageEmbed();
