const axios = require('axios');
const { firestore, discordMessageEmbed } = require('../config');
const { slugs, baseUrl, codeWarsLogo } = require('./constants');
const { randomIndex } = require('../utilities');

const getQuestion = async (slug) => {
	try {
		const { data } = await axios.get(`${baseUrl}/${slug}`);
		return data;
	} catch (err) {
		console.log({ getQuestion: err });
	}
};

const getUsedSlugs = async () => {
	try {
		const snapshot = await firestore.collection('dailyCC').doc('slugs').get();
		return snapshot.data().usedSlugs || [];
	} catch (err) {
		console.log({ getUsedSlugs: err });
	}
};

const updateFirebaseSlugs = async (slug) => {
	try {
		let usedSlugs = await getUsedSlugs(firestore);
		usedSlugs.push(slug);

		await firestore
			.collection('dailyCC')
			.doc('slugs')
			.set({ usedSlugs }, { merge: true });

		return usedSlugs;
	} catch (err) {
		console.log({ updateFirebaseSlugs: err });
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

const getUnusedSlug = async () => {
	const usedSlugs = await getUsedSlugs();
	const slug = slugs[randomIndex(slugs.length - 1)];
	return !usedSlugs.includes(slug) ? slug : getUnusedSlug();
};

const handleDailyCC = async () => {
	try {
		const slug = await getUnusedSlug();
		const question = await getQuestion(slug);
		await updateFirebaseSlugs(slug);
		return embedMessage(question);
	} catch (err) {
		console.log({ handleDailyCC: err });
	}
};

const resetDailyCCData = async () => {
	let config = { usedSlugs: [] };
	try {
		await firestore.collection('dailyCC').doc('slugs').set(config);
		return config;
	} catch (err) {
		console.log({ resetDailyCCData: err });
	}
};

exports.resetDailyCCData = resetDailyCCData;
exports.updateFirebaseSlugs = updateFirebaseSlugs;
exports.getUsedSlugs = getUsedSlugs;
exports.handleDailyCC = handleDailyCC;
