const { blaccLogo, blaccServer } = require('../../constants');
const { discordMessageEmbed, discordGuilds } = require('../../config');

exports.handleAFAF = async ({ author, channel, content }) => {
	try {
		const channels = discordGuilds.get(blaccServer).channels.cache;
		const preferredChannelId = await this.getPreferredChannel({
			author,
			currChannel: channel,
			serverChannels: channels,
		});
		await this.askAnonymously({
			question: content.slice(3).trim(),
			preferredChannel: channels.get(preferredChannelId),
		});
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

const embedMessage = (question) => {
	return discordMessageEmbed
		.setColor('#5bd64b')
		.setTitle(question)
		.setAuthor('Asking for a Friend')
		.setFooter('Black Coder Community ', blaccLogo)
		.setTimestamp();
};
