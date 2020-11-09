const { blaccLogo, blaccSmithServer } = require('../../constants');
const { discordGuilds, discordChannels } = require('../config');

exports.handleAFAF = async (message) => {
	try {
		const { author, channel, content } = message;
		if (author.bot) return;

		//returns undefined if it does not exists
		const channels = discordGuilds.get(blaccSmithServer).channels.cache;

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
	} catch (error) {
		return { handleAFAF: error };
	}
};

exports.askAnonymously = ({ question, preferredChannelId }) =>
	new Promise((resolve, reject) => {
		discordChannels
			.get(preferredChannelId)
			.send(embedMessage(question))
			.then((msg) => {
				resolve(msg);
			})
			.catch((err) => {
				console.log(error);
				reject({ askAnonymously: err });
			});
	});

exports.getPreferredChannel = async ({ author, currChannel, serverChannels }) =>
	new Promise((resolve, reject) => {
		currChannel
			.send('Where should your question be asked? `Ex: #general`')
			.then(async () => {
				const replies = await currChannel.awaitMessages(
					(message) => message.author.id == author.id,
					{ max: 1 }
				);
				const reply = replies.array()[0].content;
				return serverChannels
					.array()
					.find((item) => item.name === reply.slice(1)).id;
			})
			.catch((err) => {
				reject(err);
			});
	});

const embedMessage = (question) => {
	return discordMessageEmbed
		.setColor('#5bd64b')
		.setTitle(question)
		.setAuthor('Asking for a Friend')
		.setFooter('Black Coder Community ', blaccLogo)
		.setTimestamp();
};
