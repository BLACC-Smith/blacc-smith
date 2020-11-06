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

const addToUsedSlugs = async (slug) => {
	try {
		let usedSlugs = await getUsedSlugs(firestore);
		usedSlugs.push(slug);

		await firestore
			.collection('dailyCC')
			.doc('slugs')
			.set({ usedSlugs }, { merge: true });

		return usedSlugs;
	} catch (err) {
		console.log({ addToUsedSlugs: err });
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

//TODO error handling
const handleDailyCC = async () => {
	try {
		const usedSlugs = await getUsedSlugs();
		let slug,
			hasSlugBeenUsed = true;
		// Get an unused random slug
		while (hasSlugBeenUsed) {
			slug = slugs[randomIndex(slugs.length - 1)];
			hasSlugBeenUsed = usedSlugs.includes(slug);
		}
		// get challenge
		const question = await getQuestion(slug);
		console.log({ question });

		// update firebase
		await addToUsedSlugs(slug);

		// embed message
		return embedMessage(question);
	} catch (err) {
		console.log({ handleDailyCC: err });
	}
};

const resetDailyCCData = async () => {
	let config = {
		usedSlugs: [],
		allSlugs: slugs,
	};

	try {
		await firestore.collection('dailyCC').doc('slugs').set(config);
		return config;
	} catch (err) {
		console.log({ resetDailyCCData: err });
	}
};

exports.resetDailyCCData = resetDailyCCData;
exports.addToUsedSlugs = addToUsedSlugs;
exports.getUsedSlugs = getUsedSlugs;
exports.handleDailyCC = handleDailyCC;
