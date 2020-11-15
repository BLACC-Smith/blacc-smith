const { MessageEmbed } = require('discord.js');
const { firestore } = require('../../config');
const { blaccSmithLogo } = require('../../constants');
const { getRandomElement } = require('../../utilities');

exports.handleAffirmation = async (channel) => {
	try {
		const affirmations = await getAffirmations();
		const randomAffirmation = getRandomElement(affirmations);
		await channel.send(embedMessage(randomAffirmation));
		return randomAffirmation;
	} catch (error) {
		throw { handleAffirmation: error };
	}
};

const embedMessage = ({ quote, author }) => {
	return new MessageEmbed()
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
