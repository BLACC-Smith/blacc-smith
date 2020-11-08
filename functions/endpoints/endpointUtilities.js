exports.endpointGenerator = (channelKey, handler)=>{
	return (req, res, next)=>{
		let {discordClient} = req
		let channel = discordClient.channels.cache.get(channelKey)

		handler(channel)
		.then((result)=>{
			res.send(result);
		})
		.catch((err)=>{
			console.log(err)
			res.status(500).send({ err });
		})
		.finally(()=>{
		  next()
		})

	}
}
