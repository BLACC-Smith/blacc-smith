const axios = require("axios");
const {slugs, baseUrl} = require('./constants')
const {randomIndex, removeFromList} = require('../utilities')

const getQuestion = async (slug)=>{
	let url = baseUrl + '/' + slug
	let resp
	try{
		resp = await axios.get(url)
	}
	catch(err){
		throw err
	}

	return resp.data
}


const getUsedSlugs = async (firestore)=>{
	let snapshot
	try{
		snapshot = await firestore.collection('dailyCC').doc('slugs').get();
	}
	catch(err){
		throw err
	}

	if(snapshot.exists){
		let slugs = snapshot.data()
		return slugs.usedSlugs
	}
	else {
		throw 'Snapshot does not existt'
	}
}

const getPossibleSlugs = async({firestore, ignoreList=[]})=>{
	let snapshot
	try{
		snapshot = await firestore.collection('dailyCC').doc('slugs').get();
	}
	catch(err){
		throw err
	}

	if(snapshot.exists){
		let slugs = snapshot.data()
		return removeFromList(slugs.allSlugs, ignoreList)
	}
	else {
		throw 'Snapshot does not existt'
	}
}

const addToUsedSlugs = async ({firestore, slug})=>{
	let usedSlugs
	try{
		usedSlugs = await getUsedSlugs(firestore)
	}
	catch(err){
		throw err
	}

	usedSlugs.push(slug)

	try{
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
	//Retrieve list of used slugs
	let usedSlugList
	try{
		usedSlugList = await getUsedSlugs(firestore)
	}
	catch(err){
		throw err
	}

	//get list of unused slugs
	let unusedSlugs
	try {
		unusedSlugs = await getPossibleSlugs({firestore, ignoreList: usedSlugList})
	}
	catch(err){
		throw err
	}

	//TODO handle when there are no more unused slugs

	//Retrieve a random slug from the unused list
	let index = randomIndex(unusedSlugs.length-1)
	console.log(unusedSlugs.length)
	let slug = unusedSlugs[index]

	//Retrieve question based on the slug
	let question
	try{
		question = await getQuestion(slug)
	}
	catch(err){
		throw err
	}

	//Post the question
	try{
		await channel.send(question.url)
	}
	catch(err){
		throw err
	}

	//Update the used slugs list
	let newUsedSlugs
	try{
		newUsedSlugs = await addToUsedSlugs({firestore, slug: slug})
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
