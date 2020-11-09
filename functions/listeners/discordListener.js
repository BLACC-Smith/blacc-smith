const { handleAFAF } = require('./afaf');
const { discordClient } = require('./config');

module.exports = () => {
	discordClient.on('message', async (message) => {
		try {
			await handleAFAF(message);
		} catch (error) {
			console.log({ onMessage: error });
		}
	});
};
