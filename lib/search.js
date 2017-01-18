const db           = require('./data.json');
const firebase     = require('./firebase');
const slackMessage = require('./slackMessage');
const templates    = require('./templates');

const SLOT_REGEX = /\((\w)+\)/g;
const ID_REGEX     = /(#\w+)/g;

const ALLOWED_FLAGS = [
	'id',
	'quiet'
];

function matchCardByName(query, card) {
	let isMatch = card.key.includes(query.term);

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
	const theId = parseInt(query.term, 10);
	return searchForCardById(theId);
}

function searchByText(query) {
	return new Promise((resolve) => {
		resolve(db.filter((card) => matchCardByName(query, card)));
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

function formatSlots(slot) {
	slot = slot.replace(/\(|\)/g, '')
		.trim()
		.toLowerCase();

	if(!firebase.slots().includes(slot)) {
		slot = '';
	}

	return slot;
}

function parseSlots(queryText) {
	// Get any requested slots
	let slots   = queryText.match(SLOT_REGEX);

	if(slots) {
		slots = slots
			.map(formatSlots)
			.filter((slot) => slot.length > 0);

		// Return the slots or false if we don't have any
		return (slots.length > 0 ? slots : false);
	}
	return false;
}

function parseFags(queryText) {
	// Get any requested filters
	let flags   = queryText.match(ID_REGEX);
	if(flags) {
		flags = flags
			.map((flag) => flag.replace('#', ''))
			.map((flag) => ALLOWED_FLAGS.includes(flag) ? flag : '')
			.filter((flag) => flag.length > 0);
		// Store if we have any after filtering
		return (flags.length > 0 ? flags : false);
	}
	return false;
}

function formatSearch(term) {
	// Make sure we only compare in lowercase
	term      = term.toLowerCase();
	let slot  = parseSlots(term);
	let flags = parseFags(term)
	// Strip the command string from the search text
	term      = term
		.replace(SLOT_REGEX, '')
		.replace(ID_REGEX, '')
		.trim();

	return {
		term,
		slot,
		isPrivate: Array.isArray(flags) && flags.includes('quiet'),
		isId:      Array.isArray(flags) && flags.includes('id')
	};
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

module.exports = function search(query) {
	const search = formatSearch(query.text);

	return searchCards(search)
		.then((cards) => handleSearchResponse(cards, query, search));
};
