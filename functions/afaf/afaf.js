const {
	discordMessageEmbed,
	discordGuilds,
	discordClient,
} = require('../config');
const { blaccLogo, blaccSmithServer } = require('../constants');

exports.handleAFAF = async ({ author, channel, content }) => {
	const channels = discordGuilds.get(blaccSmithServer).channels.cache;
	if (author.bot) return;
	if (channel.type === 'dm' && content.toLowerCase().startsWith('ask')) {
		const preferredChannelId = await this.getPreferredChannel({
			author,
			currChannel: channel,
			serverChannels: channels,
		});
		this.askAnonymously({
			question: content.slice(3).trim(),
			preferredChannelId,
		});
	}
};
exports.askAnonymously = ({ question, preferredChannelId }) => {
	discordClient.channels.cache
		.get(preferredChannelId)
		.send(embedMessage(question));
};
exports.getPreferredChannel = async ({
	author,
	currChannel,
	serverChannels,
}) => {
	currChannel.send('Where should your question be asked? `Ex: #general`');
	const replies = await currChannel.awaitMessages(
		(message) => message.author.id == author.id,
		{ max: 1 }
	);
	const reply = replies.array()[0].content;
	return serverChannels.array().find((item) => item.name === reply.slice(1)).id;
};
const embedMessage = (question) => {
	return discordMessageEmbed
		.setColor('#5bd64b')
		.setTitle(question)
		.setAuthor('Asking for a Friend')
		.setFooter('Black Coder Community ', blaccLogo)
		.setTimestamp();
};
