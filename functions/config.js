const admin = require('firebase-admin');
const functions = require('firebase-functions');
const Discord = require('discord.js');

// FIREBASE ADMIN SDK
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});

// DISCORD CLIENT
const discordClient = new Discord.Client();
const { access_token } = functions.config().discord;
discordClient.login(access_token).catch((err) => console.log(err));

exports.firestore = admin.firestore();
exports.discordClient = discordClient;
