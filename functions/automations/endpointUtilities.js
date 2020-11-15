exports.endpointGenerator = (channelKey, handler) => {
	return (req, res, next) => {
		let { discordChannels } = req;
		let channel = discordChannels.get(channelKey);

		handler(channel)
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
