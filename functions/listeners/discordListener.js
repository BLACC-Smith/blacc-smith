const { discordClient } = require('./config');
const { handleDMs, handleChannelMessages } = require('./handlers');

module.exports = () => {
	discordClient.on('message', async (message) => {
		try {
			if (message.author.bot) return;
			if (message.channel.type === 'dm') handleDMs(message);
			else handleChannelMessages(message);
		} catch (error) {
			console.log({ onMessage: error });
		}
	});
};
