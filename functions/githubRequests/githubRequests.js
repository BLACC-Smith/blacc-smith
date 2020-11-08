const { Octokit } = require('@octokit/core');
const { blaccSmithChannel } = require('../constants');

exports.handleNewIssue = async ({ channel, issue, access_token }) => {
	try {
		if (channel.id === blaccSmithChannel) {
			return await postIssue({ issue, access_token });
		} else
			channel.send(
				'All feature requests must be sent to the `#blacc-smith` channel'
			);
	} catch (error) {
		throw { handleNewIssue: error };
	}
};

const postIssue = async ({ issue, access_token }) => {
	const octokit = new Octokit({ auth: access_token });
	try {
		const { data } = await octokit.request('POST /repos/:owner/:repo/issues', {
			owner: 'Garrett1Tolbert',
			repo: 'blacc-smith',
			title: issue,
			labels: [
				'Feature'
			]
		});
		return data.html_url;
	} catch (error) {
		throw { postRequest: error };
	}
};
