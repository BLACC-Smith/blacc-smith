const functions = require('firebase-functions');
const { apiUrl } = require('./constants');

exports.randomIndex = (maxIndex) => Math.round(Math.random() * maxIndex);
exports.removeFromList = (list, itemsToRemove) =>
	list.filter((item) => !itemsToRemove.includes(item));
exports.getRandomElement = (list) => {
	if (!list.length) throw { getRandomElement: 'List is empty' };
	return list[this.randomIndex(list.length)];
};
exports.scheduledJob = (cronJob, feature) => {
	return functions.pubsub
		.schedule(cronJob)
		.timeZone('US/Central')
		.onRun(() => {
			try {
				const { data } = axios.get(`${apiUrl}/${feature}`);
				return data;
			} catch (error) {
				throw 'Cannot get affirmation';
			}
		});
};
