const { firestore } = require('../../config');
const { MessageEmbed } = require('discord.js');
const { blaccSmithLogo } = require('../../constants');
const { randomIndex } = require('../../utilities');

exports.getAffirmation = async () => {
	const affirmations = await getAffirmations();
	const randomAffirmation = affirmations[randomIndex(affirmations.length - 1)];
	return embedMessage(randomAffirmation);
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
		const doc = await firestore
			.collection('constants')
			.doc('affirmations')
			.get();
		return doc.data().affirmations;
	} catch (error) {
		throw error;
	}
};
