const axios = require("axios");
const {slugs, baseUrl} = require('./constants')
const {randomIndex, removeFromList} = require('../utilities')

const getQuestion = async (slug)=>{
	let url = baseUrl + '/' + slug
	try{
		let resp = await axios.get(url)
		return resp.data
	}
	catch(err){
		throw err
	}
}


const getUsedSlugs = async (firestore)=>{
	try{
		let snapshot = await firestore.collection('dailyCC').doc('slugs').get();
		if(snapshot.exists){
			let slugs = snapshot.data()
			return slugs.usedSlugs
		}
		else {
			throw 'Snapshot does not existt'
		}
	}
	catch(err){
		throw err
	}

}

const getPossibleSlugs = async({firestore, ignoreList=[]})=>{
	try{
		let snapshot = await firestore.collection('dailyCC').doc('slugs').get();

		if(snapshot.exists){
			let slugs = snapshot.data()
			return removeFromList(slugs.allSlugs, ignoreList)
		}
		else {
			throw 'Snapshot does not existt'
		}
	}
	catch(err){
		throw err
	}

}

const addToUsedSlugs = async ({firestore, slug})=>{
	try{
		let usedSlugs = await getUsedSlugs(firestore)
		usedSlugs.push(slug)

		await firestore
		.collection('dailyCC')
		.doc('slugs')
		.set({usedSlugs}, {merge: true})

		return usedSlugs
	}
	catch(err){
		throw err
	}
}

//TODO error handling
const handleDailyCC = async({channel, firestore})=>{
	try{
		//Retrieve list of used slugs
		let usedSlugList = await getUsedSlugs(firestore)

		//get list of unused slugs
		let unusedSlugs = await getPossibleSlugs({firestore, ignoreList: usedSlugList})

		//TODO handle when there are no more unused slugs

		//Retrieve a random slug from the unused list
		let index = randomIndex(unusedSlugs.length-1)
		let slug = unusedSlugs[index]

		//Retrieve question based on the slug
		let question = await getQuestion(slug)

		//Post the question
		await channel.send(question.url)

		//Update the used slugs list
		await addToUsedSlugs({firestore, slug: slug})
	}
	catch(err){
		throw err
	}

	//Return the url that was posted
	return question.url
}

const resetDailyCCData = async (firestore)=>{
	let config = {
		usedSlugs: [],
		allSlugs: slugs,
	}

	try{
		await firestore
		.collection('dailyCC')
		.doc('slugs')
		.set(config)
	}
	catch(err){
		reject(err)
	}

	return config
}

exports.resetDailyCCData = resetDailyCCData
exports.addToUsedSlugs = addToUsedSlugs
exports.getUsedSlugs = getUsedSlugs
exports.getPossibleSlugs = getPossibleSlugs
exports.handleDailyCC = handleDailyCC
