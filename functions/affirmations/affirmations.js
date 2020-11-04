const { firestore } = require('../config');
const { randomIndex } = require('../utilities');

module.exports = async () => {
	const affirmations = await getAffirmation();
	const { quote, author } = affirmations[randomIndex(affirmations.length - 1)];
	return `${quote}${!author ? '' : ` - ${author}`}`;
};

const getAffirmation = async () => {
	try {
		const doc = await firestore
			.collection('constants')
			.doc('affirmations')
			.get();
		return doc.data().affirmations;
	} catch (error) {
		throw error;
	}
};
