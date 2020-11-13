const { discordLoginMiddleware } = require('./middleware');
const { generalChannel, technicalInterviewsChannel } = require('../constants');
const { handleDailyCC } = require('./dailyCC');
const { handleAffirmation } = require('./affirmations');
const { endpointGenerator } = require('./endpointUtilities');
const express = require('express');
const app = express();

//Setup Middleware
app.use(discordLoginMiddleware);

//Endpoints
app.get(
	'/daily-cc',
	endpointGenerator(technicalInterviewsChannel, handleDailyCC)
);
app.get('/affirmations', endpointGenerator(generalChannel, handleAffirmation));

//Cleanup Middleware
app.use((req, res, next) => {
	let { discordClient } = req;
	discordClient.destroy();
});

//Fixes Heroku Error R10 (Boot timeout)
// app.listen(process.env.PORT || 8080);

module.exports = app;
