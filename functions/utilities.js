exports.randomIndex = (maxIndex) => Math.round(Math.random() * maxIndex);
exports.removeFromList = (list, itemsToRemove) =>
	list.filter((item) => !itemsToRemove.includes(item));
