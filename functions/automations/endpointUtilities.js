exports.endpointGenerator = (channelKey, handler) => {
	return (req, res, next) => {
		const { discordChannels, query } = req;
		const channel = discordChannels.get(channelKey);

		handler(channel, { ...query })
			.then((result) => {
				res.send(result);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send({ err });
			})
			.finally(() => {
				next();
			});
	};
};
