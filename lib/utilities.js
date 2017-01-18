

function checkEquality(existingCard, updatedCard) {
	// Create arrays of property names
	const existingCardProps = Object.getOwnPropertyNames(existingCard);
	const updatedCardProps  = Object.getOwnPropertyNames(updatedCard);
	const propLength        = updatedCardProps.length;

	// If number of properties is different,
	// objects are not equivalent
	if (propLength !== existingCardProps.length) {
		return false;
	}

	for (let i = 0; i < propLength; i++) {
		let propName = existingCardProps[i];

		// If values of same property are not equal,
		// objects are not equivalent
		if (existingCard[propName] !== updatedCard[propName]) {
			return false;
		}
	}

	// If we made it this far, objects
	// are considered equivalent
	return true;
}

function arrayToObject(theArray, keyFunction) {
	if(theArray.length) {
		return theArray.reduce((theObject, arrayItem) => {
			theObject[keyFunction(arrayItem)] = arrayItem;
			return theObject;
		}, {});
	}

	return {};
}

function echoData(promiseData) {
	console.log(promiseData);
	return promiseData;
}

function getCardIdFlag(card) {
	if(card.slot === 'pilot') {
		return 'p';
	}

	return 'u';
}

function cardId(card) {
	return card.id + getCardIdFlag(card);
}

module.exports = {
	checkEquality,
	arrayToObject,
	echoData,
	cardId
}
