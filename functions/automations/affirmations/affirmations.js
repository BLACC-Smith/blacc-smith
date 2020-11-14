const {
	firestore,
	discordMessageEmbed,
	discordChannels,
} = require('../../config');
const { blaccSmithLogo, generalChannel } = require('../../constants');
const { getRandomElement } = require('../../utilities');

exports.handleAffirmation = async () => {
	try {
		const affirmations = await getAffirmations();
		const randomAffirmation = getRandomElement(affirmations);
		await discordChannels
			.get(generalChannel)
			.send(embedMessage(randomAffirmation));
	} catch (error) {
		throw { handleAffirmation: error };
	}
};

const embedMessage = ({ quote, author }) => {
	return discordMessageEmbed
		.setColor('#fcba03')
		.setTitle(quote)
		.setDescription(author)
		.setAuthor('Good Morning 🌞')
		.setFooter('Black Coder Community ', blaccSmithLogo)
		.setTimestamp();
};

const getAffirmations = async () => {
	try {
		const snapshot = await firestore
			.collection('constants')
			.doc('affirmations')
			.get();
		if (!snapshot.exists) throw `Snapshot doesn't exist`;
		return snapshot.data().affirmations;
	} catch (error) {
		throw { getAffirmations: error };
	}
};
