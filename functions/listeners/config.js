const functions = require('firebase-functions');
const Discord = require('discord.js');

// DISCORD CLIENT
const discordClient = new Discord.Client();
const { access_token } = functions.config().discord;
discordClient.login(access_token).catch((err) => console.log(err));

exports.discordClient = discordClient;
exports.discordGuilds = discordClient.guilds.cache;
exports.discordChannels = discordClient.channels.cache;
