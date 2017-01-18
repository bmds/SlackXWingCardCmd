const db           = require('./data.json');
const slackMessage = require('./slackMessage');
const templates    = require('./templates');

const FILTER_REGEX = /\((\w)+\)/g;
const ID_REGEX     = /(#\w+)/g;

const ALLOWED_FILTERS = [
	'astromech',
	'bomb',
	'cannon',
	'cargo',
	'crew',
	'elite',
	'hardpoint',
	'illicit',
	'pilot',
	'missile',
	'modification',
	'salvaged astromech',
	'system',
	'team',
	'tech',
	'title',
	'torpedo',
	'turret'
];

const ALLOWED_FLAGS = [
	'id',
	'quiet'
];

function matchCardByName(query, card) {
	let isMatch = card.key.includes(query.term);

	if(isMatch && query.filter) {
		isMatch = query.filter.includes(card.slot);
	}

	return isMatch;
}

function matchCardById(query, card) {
	return card.id === query.term;
}

function searchCards(query) {
	if(query.isId) {
		query.term = parseInt(query.term, 10);
		return [db.find((card) => matchCardById(query, card))];
	}
	return db.filter((card) => matchCardByName(query, card));
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

function formatFilters(filter) {
	filter = filter.replace(/\(|\)/g, '')
		.trim()
		.toLowerCase();

	if(!ALLOWED_FILTERS.includes(filter)) {
		filter = '';
	}

	return filter;
}

function parseFilters(queryText) {
	// Get any requested filters
	let filters   = queryText.match(FILTER_REGEX);
	if(filters) {
		filters = filters.map(formatFilters).filter((theFilter) => theFilter.length > 0);
		// Store if we have any after filtering
		return (filters.length > 0 ? filters : false);
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
	term       = term.toLowerCase();
	let filter = parseFilters(term);
	let flags  = parseFags(term)
	// Strip the filter string from the search text
	term       = term
		.replace(FILTER_REGEX, '')
		.replace(ID_REGEX, '')
		.trim();

	return {
		term,
		filter,
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

module.exports = function search(query) {
	const search      = formatSearch(query.text);
	const foundCards  = searchCards(search);
	const resultCount = foundCards.length;

	if(resultCount === 0) {
		return handleNotFound(query);
	} else if(resultCount === 1) {
		return convertCardToResponse(foundCards[0], search.isPrivate);
	} else {
		return handleMultipleCards(foundCards, query);
	}
};