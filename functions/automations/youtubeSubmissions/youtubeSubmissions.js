const functions = require('firebase-functions');
const { MessageEmbed } = require('discord.js');
const { default: axios } = require('axios');
const {
	apiUrl,
	blaccSmithServer,
	youtubeUploaderChannel,
} = require('../../constants');
const { discordGuilds } = require('../../config');

exports.storageHandler = () =>
	functions.storage.object().onFinalize(async (object) => {
		try {
			await axios.get(`${apiUrl}/youtube-submission`, {
				params: object.metadata,
			});
			console.log({ object });
		} catch (error) {
			throw { storageHandler: error };
		}
	});
exports.handleYoutubeSubmission = async (channel, metadata) => {
	try {
		const channel = discordGuilds
			.get(blaccSmithServer)
			.channels.cache.get(youtubeUploaderChannel);

		await channel.send(embedMessage(metadata));
		console.log('Alerted moderators');
	} catch (error) {
		throw { handleYoutubeSubmissions: error };
	}
};

const embedMessage = (data) => {
	return new MessageEmbed()
		.setColor('#c4302b')
		.setAuthor(`Submission from ${data.username}`)
		.setTitle(data.title)
		.setURL('https://admin.blacc.xyz/')
		.setTimestamp();
};
