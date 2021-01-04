exports.handleYoutubeSubmission = async (channel) => {
	try {
		await channel.send('📺 New Submission Alert');
		console.log('Alerted moderators');
	} catch (error) {
		throw { handleYoutubeSubmissions: error };
	}
};
