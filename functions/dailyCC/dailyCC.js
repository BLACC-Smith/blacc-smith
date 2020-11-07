const axios = require('axios');
const { firestore, discordMessageEmbed } = require('../config');
const { slugs, baseUrl, codeWarsLogo } = require('./constants');
const {
	randomIndex,
	removeFromList,
	getRandomElement,
} = require('../utilities');

const getQuestion = async (slug) => {
	try {
		const { data } = await axios.get(`${baseUrl}/${slug}`);
		return data;
	} catch (err) {
		throw { getQuestion: err };
	}
};

const getUsedSlugs = async () => {
	try {
		const snapshot = await firestore.collection('dailyCC').doc('slugs').get();
		if (snapshot.exists) return snapshot.data().usedSlugs;
		throw { getUsedSlugs: `Snapshot doesn't exist` };
	} catch (err) {
		throw { getUsedSlugs: err };
	}
};

const updateFirebaseSlugs = async (slug, usedSlugs) => {
	try {
		usedSlugs.push(slug);
		await firestore
			.collection('dailyCC')
			.doc('slugs')
			.set({ usedSlugs }, { merge: true });

		return usedSlugs;
	} catch (err) {
		throw { updateFirebaseSlugs: err };
	}
};
const embedMessage = ({ url, description, name, category, rank }) => {
	return discordMessageEmbed
		.setColor(rank.color.toUpperCase())
		.setTitle(name)
		.setDescription(`${description.substring(0, 500)}...`)
		.setAuthor(`💡Today's Challenge`)
		.setFooter('Codewars', codeWarsLogo)
		.setURL(url)
		.addFields(
			{ name: '\u200B', value: '\u200B' },
			{
				name: 'Category',
				value: category.charAt(0).toUpperCase() + category.slice(1),
				inline: true,
			},
			{ name: 'Difficulty', value: rank.name, inline: true }
		)
		.setTimestamp();
};

const handleDailyCC = async () => {
	try {
		const usedSlugs = await getUsedSlugs();
		const slug = getRandomElement(removeFromList(slugs, usedSlugs));
		const question = await getQuestion(slug);
		await updateFirebaseSlugs(slug, usedSlugs);
		return embedMessage(question);
	} catch (err) {
		throw { handleDailyCC: err };
	}
};

const resetDailyCCData = async () => {
	let config = { usedSlugs: [] };
	try {
		await firestore.collection('dailyCC').doc('slugs').set(config);
		return config;
	} catch (err) {
		throw { resetDailyCCData: err };
	}
};

exports.resetDailyCCData = resetDailyCCData;
exports.updateFirebaseSlugs = updateFirebaseSlugs;
exports.getUsedSlugs = getUsedSlugs;
exports.handleDailyCC = handleDailyCC;
