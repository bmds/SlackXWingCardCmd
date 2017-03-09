const firebase = require('../src/firebase');

function matchCardByName(query, card) {
	let isMatch = card.key.includes(query.term);

	if(!isMatch && card.alias) {
		isMatch = card.alias.includes(query.term);
	}

	if(isMatch && query.slot) {
		isMatch = query.slot.includes(card.slot);
	}

	return isMatch;
}

function searchById(cardId) {
	return firebase.refs.cards.child(cardId)
		.once('value')
		.then((snapshot) => snapshot.val())
		.then((card) => typeof card === 'object' ? [card] : []);
}

function searchByText(query) {
	return new Promise((resolve) => {
		let cards = firebase.cards.data()
			.filter((card) => matchCardByName(query, card));
		resolve(cards);
	});
}

function searchCards(query) {
	if(query.isId) {
		return searchById(query);
	}

	return searchByText(query);
}

module.exports.byId = function run(query) {
	return searchById(query);
};

module.exports.byText = function run(query) {
	return searchByText(query);
};
