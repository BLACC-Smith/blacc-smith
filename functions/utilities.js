const functions = require('firebase-functions');
const { discordClient } = require('./config');
var schedule = require('node-schedule');

exports.randomIndex = (maxIndex) => Math.round(Math.random() * maxIndex);
exports.removeFromList = (list, itemsToRemove) =>
	list.filter((item) => !itemsToRemove.includes(item));
exports.getRandomElement = (list) => {
	if (!list.length) throw { getRandomElement: 'List is empty' };
	return list[this.randomIndex(list.length)];
};
exports.jobScheduler = (cronJob, hanler) => {
	return schedule.scheduleJob(cronJob, () => {
		discordClient.on('ready', () => {
			console.log({ status: 'successful' });
			hanler();
		});
	});
};
exports.scheduledJob = (cronJob, handler) => {
	return functions.pubsub
		.schedule(cronJob)
		.timeZone('US/Central')
		.onRun(async () => {
			discordClient.on('ready', () => {
				console.log('Client is ready');
				handler();
			});
		});
};
