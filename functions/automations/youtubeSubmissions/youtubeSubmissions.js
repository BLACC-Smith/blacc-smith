const { MessageEmbed } = require('discord.js');

exports.handleYoutubeSubmission = async (channel) => {
	try {
		await channel.send(embedMessage());
		console.log('Alerted moderators');
	} catch (error) {
		throw { handleYoutubeSubmissions: error };
	}
};

const embedMessage = () => {
	return new MessageEmbed()
		.setColor('#c4302b')
		.setTitle('📺 New Submission Alert')
		.setURL('https://admin.blacc.xyz/')
		.setTimestamp();
};
