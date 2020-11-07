const { discordMessageEmbed } = require('../config');
const { blaccLogo } = require('../constants');

exports.askAnonymously = (question, preferredChannelId, discordClient) => {
	discordClient.channels.cache
		.get(preferredChannelId)
		.send(embedMessage(question));
};
exports.getChannel = async (author, currChannel, serverChannels) => {
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
