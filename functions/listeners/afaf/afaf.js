const { MessageEmbed } = require('discord.js');
const { discordGuilds } = require('../../config');
const { blaccLogo, blaccServer } = require('../../constants');

/**
 * @param {object} message - the message that was sent in Discord
 * @property {object} author - the creator of the message that was sent
 * @property {object} channel - the channel the message was sent in
 * @property {string} content - the message content itself
 *
 * @description Handles the asking for a friend functionality.
 */
exports.handleAFAF = async ({ author, channel, content }) => {
	try {
		const channels = discordGuilds.get(blaccServer).channels.cache;
		const preferredChannelId = await this.getPreferredChannel(
			author,
			channel,
			channels
		);
		await this.askAnonymously(
			content.slice(3).trim(),
			channels.get(preferredChannelId)
		);
	} catch (err) {
		throw { handleAFAF: err };
	}
};

/**
 * @param {string} question - the question to be asked
 * @param {object} preferredChannel - where the question should be posted
 *
 * @description Sends question to the preferred channel.
 */
exports.askAnonymously = async (question, preferredChannel) => {
	try {
		await preferredChannel.send(embedMessage(question));
	} catch (err) {
		throw { askAnonymously: err };
	}
};

/**
 * @param {object} author - whoever DM'd the bot
 * @param {object} currChannel - the channel the DM was sent to
 * @param {object} serverChannels - all the channels in the server
 *
 * @description Asks user which channel they want their questions to
 * be posted in.
 */
exports.getPreferredChannel = async (author, currChannel, serverChannels) => {
	try {
		await currChannel.send(
			'Where should your question be asked? `Ex: #general`'
		);
		const replies = await currChannel.awaitMessages(
			(message) => message.author.id == author.id,
			{ max: 1 }
		);
		const reply = replies.array()[0].content;

		if (reply.toLowerCase().startsWith('ask')) {
			throw 'cancelled by user asking another question';
		}

		const channel = serverChannels
			.array()
			.find((item) => item.name === reply.slice(1));
		if (!channel) {
			await currChannel.send(
				`\`${reply}\` channel doesn't exist. Did you spell it correctly?`
			);
			return this.getPreferredChannel({
				author,
				currChannel,
				serverChannels,
			});
		}
		return channel.id;
	} catch (error) {
		throw { getPreferredChannel: error };
	}
};

/**
 * @param {string} question - question to be asked
 *
 * @description Returns question as an embedded message.
 */
const embedMessage = (question) => {
	return new MessageEmbed()
		.setColor('#5bd64b')
		.setTitle(question)
		.setAuthor('Asking for a Friend')
		.setFooter('Black Coder Community ', blaccLogo)
		.setTimestamp();
};
