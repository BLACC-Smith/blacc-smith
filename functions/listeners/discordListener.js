const Discord = require('discord.js');
const functions = require('firebase-functions');
const { handleAFAF } = require('./afaf');

// DISCORD CLIENT
const discordClient = new Discord.Client();
const { access_token } = functions.config().discord;
discordClient.login(access_token).catch((err) => {
	console.log(err)
});

module.exports = ()=>{
  discordClient.on('message', async (message) => {
  	try {
  		await handleAFAF(message);
  	} catch (error) {
  		throw 'Error occured while asking for a friend';
  	}
  })
}
