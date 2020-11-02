
exports.randomIndex = (maxIndex)=>{
	return Math.round(Math.random() * maxIndex);
}

exports.removeFromList = (list, itemsToRemove)=>{
	let newList = [...list]

	itemsToRemove.forEach((item)=>{
		let index = list.indexOf(item)
		newList.splice(index, 1)
	})

	return newList
}
