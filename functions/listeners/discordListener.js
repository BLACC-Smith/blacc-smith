const { handleAFAF } = require('./afaf');
const { discordClient, discordGuilds } = require('./config');

module.exports = () => {
	discordClient.on('message', async (message) => {
		try {
			await handleAFAF({discordClient, discordGuilds, message});
		} catch (error) {
			console.log({onMessage: error})
		}
	});
};
