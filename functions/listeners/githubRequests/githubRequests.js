const { Octokit } = require('@octokit/core');
const { blaccSmithChannel } = require('../../constants');
const { discordMessageEmbed } = require('../config');
const { githubLogo } = require('./constant');

exports.handleNewIssue = async ({ author, channel, issue, access_token }) => {
	try {
		if (channel.id !== blaccSmithChannel) {
			return 'All feature requests must be sent to the `#blacc-smith` channel';
		}
		return await getIssue({ author, issue, access_token });
	} catch (error) {
		throw { handleNewIssue: error };
	}
};

const getIssue = async ({ author, issue, access_token }) => {
	const octokit = new Octokit({ auth: access_token });
	try {
		const { data } = await octokit.request('POST /repos/:owner/:repo/issues', {
			owner: 'Garrett1Tolbert',
			repo: 'blacc-smith',
			title: issue,
			labels: ['Community Request'],
		});
		return embedMessage({ data, author });
	} catch (error) {
		throw { postRequest: error };
	}
};
const embedMessage = ({ data, author }) => {
	return discordMessageEmbed
		.setColor('#2196f3')
		.setTitle(data.title)
		.setAuthor(`New Feature Request | ${author.username}`)
		.setFooter('Github', githubLogo)
		.setURL(data.html_url)
		.setTimestamp();
};
