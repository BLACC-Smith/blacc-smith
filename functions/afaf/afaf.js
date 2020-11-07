const { discordMessageEmbed } = require('../config');
const { blaccLogo } = require('../constants');

exports.askAnonymously = (question, preferredChannel, discordClient) => {
	discordClient.channels.cache
		.get(preferredChannel)
		.send(embedMessage(question));
};

const embedMessage = (question) => {
	return discordMessageEmbed
		.setColor('#5bd64b')
		.setTitle(question)
		.setAuthor('Asking for a Friend')
		.setFooter('Black Coder Community ', blaccLogo)
		.setTimestamp();
};
