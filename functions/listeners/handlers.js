const { handleAFAF } = require('./afaf');
const { handleNewIssue } = require('./githubRequests');
const { functionsConfig } = require('../config');

exports.handleDMs = async ({ author, channel, content }) => {
	try {
		switch (content.toLowerCase().split(' ')[0]) {
			case 'ask':
				await handleAFAF({ author, channel, content });
		}
	} catch (error) {
		console.log({ handleDMs: error });
	}
};
exports.handleChannelMessages = ({ author, channel, content }) =>
	new Promise(async (resolve, reject) => {
		try {
			switch (content.toLowerCase().split(' ')[0]) {
				case 'feature:':
					const newIssue = await handleNewIssue({
						author,
						issue: content.slice(8).trim(),
						channel,
						access_token: functionsConfig.github.access_token,
					});
					channel
						.send(newIssue)
						.then((message) => {
							resolve(message);
						})
						.catch((error) => {
							reject({ handleChannelMessages: error });
						});
			}
		} catch (error) {
			reject({ handleChannelMessages: error });
		}
	});
