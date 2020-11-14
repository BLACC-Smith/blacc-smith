const axios = require('axios');
const { firestore, discordChannels } = require('../../config');
const { MessageEmbed } = require('discord.js');
const { slugs, baseUrl, codeWarsLogo } = require('./constants');
const { removeFromList, getRandomElement } = require('../../utilities');
const { technicalInterviewsChannel } = require('../../constants');

const handleDailyCC = async () => {
	try {
		const { slug, slugs, message } = await getDailyCC();
		const sentMessage = await discordChannels
			.get(technicalInterviewsChannel)
			.send(message);
		sentMessage.pin();
		await updateFirebaseSlugs(slug, slugs);
	} catch (error) {
		throw { handleDailyCC: error };
	}
};

const getDailyCC = async () => {
	try {
		const usedSlugs = await getUsedSlugs();
		const slug = getRandomElement(removeFromList(slugs, usedSlugs));
		const question = await getQuestion(slug);
		return { slug, slugs: usedSlugs, message: embedMessage(question) };
	} catch (error) {
		throw { getDailyCC: error };
	}
};
const getUsedSlugs = async () => {
	try {
		const snapshot = await firestore.collection('dailyCC').doc('slugs').get();
		if (!snapshot.exists) throw `Snapshot doesn't exist`;
		return snapshot.data().usedSlugs;
	} catch (error) {
		throw { getUsedSlugs: error };
	}
};
const getQuestion = async (slug) => {
	try {
		const { data } = await axios.get(`${baseUrl}/${slug}`);
		return data;
	} catch (err) {
		throw { getQuestion: err };
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
	return new MessageEmbed()
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
