const { firestore } = require('../../config');
const { MessageEmbed } = require('discord.js');
const { blaccSmithLogo } = require('../../constants');
const { getRandomElement } = require('../../utilities');

exports.handleAffirmation = (channel) =>
	new Promise(async (resolve, reject) => {
		try {
			const affirmations = await getAffirmations();
			const randomAffirmation = getRandomElement(affirmations);
			let message = embedMessage(randomAffirmation);

			channel
				.send(message)
				.then((message) => {
					resolve(message);
				})
				.catch((error) => {
					reject({ handleAffirmation: error });
				});
		} catch (error) {
			reject({ handleAffirmation: error });
		}
	});

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
		throw { getAffirmations: error };
	}
};
