const { discordLoginMiddleware } = require('./middleware');
const {
	generalChannel,
	technicalInterviewsChannel,
	moderatorsChannel,
} = require('../constants');
const { handleDailyCC } = require('./dailyCC');
const { handleAffirmation } = require('./affirmations');
const { endpointGenerator } = require('./endpointUtilities');
const express = require('express');
const { handleYoutubeSubmission } = require('./youtubeSubmissions');
const app = express();

//Setup Middleware
app.use(discordLoginMiddleware);

//Endpoints
app.get(
	'/daily-cc',
	endpointGenerator(technicalInterviewsChannel, handleDailyCC)
);
app.get('/affirmations', endpointGenerator(generalChannel, handleAffirmation));
app.get(
	'/youtube-submission',
	endpointGenerator(moderatorsChannel, handleYoutubeSubmission)
);

//Cleanup Middleware
app.use((req, res, next) => {
	let { discordClient } = req;
	discordClient.destroy();
});

module.exports = app;
