const functions = require('firebase-functions');
const Discord = require('discord.js');

const { access_token } = functions.config().discord;

// DISCORD CLIENT
const discordClient = new Discord.Client();
discordClient.login(access_token).catch((err) => console.log(err));

exports.discordClient = discordClient;
exports.discordGuilds = discordClient.guilds.cache;
exports.discordChannels = discordClient.channels.cache;
exports.discordMessageEmbed = new Discord.MessageEmbed();
exports.functionsConfig = functions.config();
