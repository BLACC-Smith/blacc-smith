const functions = require('firebase-functions');
const axios = require('axios');
const { apiUrl } = require('./constants');

exports.randomIndex = (maxIndex) => Math.round(Math.random() * maxIndex);
exports.removeFromList = (list, itemsToRemove) =>
	list.filter((item) => !itemsToRemove.includes(item));
exports.getRandomElement = (list) => {
	if (!list.length) throw { getRandomElement: 'List is empty' };
	return list[this.randomIndex(list.length)];
};
exports.scheduledJob = (cronJob, handler) => {
	return functions.pubsub
		.schedule(cronJob)
		.timeZone('US/Central')
		.onRun(() => {
			try {
				handler();
			} catch (error) {
				throw { handler: error };
			}
		});
};
