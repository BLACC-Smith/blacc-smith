const { discordLoginMiddleware } = require('./middleware');
const { dailyccChannel, affirmationsChannel, apiUrl } = require('../constants');
const { handleDailyCC } = require('./dailyCC');
const { getAffirmation } = require('./affirmations');
const express = require('express');
const app = express();

//Setup Middleware
app.use(discordLoginMiddleware);


//Endpoints
app.get('/daily-cc', async (req, res, next) => {
	let {discordClient} = req

	try {
		const question = await handleDailyCC();
		if (!question) {
			res.status(404).send('Cannot retrieve data');
			return;
		}
		// discordClient.channels.cache
		// .get(dailyccChannel)
		// .send(question)
		// .then((msg) => {
		// 	msg.pin();
		// 	res.send(question);
		// });
		res.send(question);
	} catch (err) {
		console.log(err)
		res.status(500).send({ err });
	}

  next()
});

app.get('/affirmations', async (req, res, next) => {
	let {discordClient} = req

	try {
		const message = await getAffirmation();
		if (!message) {
			res.status(404).send('Cannot retrieve data');
			return;
		}
		//discordClient.channels.cache.get(affirmationsChannel).send(message);
		res.send(message);
	} catch (error) {
		console.log(err)
		res.status(500).send({ err });
	}

  next()
});

//Cleanup Middleware
app.use((req, res, next)=>{
	let {discordClient} = req
  discordClient.destroy()
});

module.exports = app;
