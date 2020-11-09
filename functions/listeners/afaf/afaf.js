const { blaccLogo, blaccSmithServer } = require('../../constants');
const { discordMessageEmbed, discordGuilds } = require('../config');

exports.handleAFAF = async (message) => {
	try {
		const { author, channel, content } = message;
		if (author.bot) return;

		const channels = discordGuilds.get(blaccSmithServer).channels.cache;

		if (channel.type === 'dm' && content.toLowerCase().startsWith('ask')) {
			const preferredChannelId = await this.getPreferredChannel({
				author,
				currChannel: channel,
				serverChannels: channels,
			});
			await this.askAnonymously({
				question: content.slice(3).trim(),
				preferredChannel: channels.get(preferredChannelId),
			});
		}
	} catch (err) {
		throw { handleAFAF: err };
	}
};

exports.askAnonymously = async ({ question, preferredChannel }) => {
	try {
		await preferredChannel.send(embedMessage(question));
	} catch (err) {
		throw { askAnonymously: err };
	}
};

exports.getPreferredChannel = async ({
	author,
	currChannel,
	serverChannels,
}) => {
	try {
		await currChannel.send(
			'Where should your question be asked? `Ex: #general`'
		);
		const replies = await currChannel.awaitMessages(
			(message) => message.author.id == author.id,
			{ max: 1 }
		);
		const reply = replies.array()[0].content;

		if (reply.toLowerCase() === 'cancel') {
			throw 'cancelled by user';
		}
		if (reply.toLowerCase().startsWith('ask')) {
			throw 'cancelled by user asking another question';
		}

		const channel = serverChannels
			.array()
			.find((item) => item.name === reply.slice(1));
		if (channel === undefined) {
			await currChannel.send(
				`Channel \`${reply}\` doesn't exist, are you sure you spelled that right?\n` +
					`Send "cancel" without quotes to cancel.`
			);
			return await this.getPreferredChannel({
				author,
				currChannel,
				serverChannels,
			});
		} else {
			return channel.id;
		}
	} catch (err) {
		throw { getPreferredChannel: err };
	}
};

const embedMessage = (question) => {
	return discordMessageEmbed
		.setColor('#5bd64b')
		.setTitle(question)
		.setAuthor('Asking for a Friend')
		.setFooter('Black Coder Community ', blaccLogo)
		.setTimestamp();
};
