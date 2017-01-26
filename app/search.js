const slackMessage = require('../src/slackMessage');
const templates    = require('../src/templates');
const queryParser  = require('../src/queryParser');

let firebase;

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

function searchForCardById(cardId) {
	return firebase.refs.cards.child(cardId)
		.once('value')
		.then((snapshot) => snapshot.val())
		.then((card) => typeof card === 'object' ? [card] : []);
}

function searchById(query) {
	return searchForCardById(query.term);
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

function convertCardToResponse(card, isPrivate) {
	let responseData = {
		text:      templates.card(card),
		image:     card.image,
		isPrivate
	};

	return slackMessage(responseData);
}

function handleMultipleCards(foundCards, query) {
	return slackMessage({
		text:      templates.multiple(foundCards, query),
		isPrivate: true
	});
}

function handleNotFound(query) {
	return slackMessage({
		text:      templates.notFound(query),
		isPrivate: true
	});
}

function handleSearchResponse(cards, query, search) {
	const resultCount = cards.length;

	if(resultCount === 0) {
		return handleNotFound(query);
	} else if(resultCount === 1) {
		return convertCardToResponse(cards[0], search.isPrivate);
	} else {
		return handleMultipleCards(cards, query);
	}
}

module.exports.setDb = function setDb(db) {
	firebase = db;
}

module.exports.run   = function run(query) {
	const search = queryParser.format(query.text, firebase.slots.data);

	return searchCards(search)
		.then((cards) => handleSearchResponse(cards, query, search));
};
