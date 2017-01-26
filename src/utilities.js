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
	switch(card.slot) {
		case 'pilot':
			return 'p';
		case 'condition':
			return 'c';
		default:
			return 'u';
	}
}

function cardId(card) {
	return card.id + getCardIdFlag(card);
}

module.exports = {
	arrayToObject,
	echoData,
	cardId
}
