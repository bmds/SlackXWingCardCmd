const { send } = require('micro');
const qs       = require('querystring');
const url      = require('url');
const db       = require('./lib/data.json');

const RESPONSE_PUBLIC  = 'in_channel';
const RESPONSE_PRIVATE = 'ephemeral';

const FILTER_REGEX = /\((\w)+\)/g;

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

// Required names for slack
/*eslint-disable camelcase */
const baseResponse = {
	parse:         'full',
	text:          '',
	unfurl_media:  true
};
/*eslint-enable camelcase */

function findCard(query) {
	return db.filter((card) => {
		let isMatch = card.key.includes(query.term);

		if(isMatch && query.filter) {
			isMatch = query.filter.includes(card.slot);
		}

		return isMatch;
	});
}

function populateTemplate(card) {
	let limited = card.limited ? ' | limited' : '';
	let unique  = card.unique ? ' | unique' : '';

	return `${card.name} (${card.slot}${limited}${unique}) - ${card.points}pt${card.points > 1 ? 's': ''}
${card.text}`;
}

function populateMultipleCardTemplate(currentString, card) {
	if(typeof currentString === 'object') {
		currentString = populateMultipleCardTemplate('', currentString);
	}

	return currentString + `\n• ${card.name} (${card.slot}) use \`/card ${card.name} (${card.slot})\``;
}

function createResponseObject(data) {
	let responseObject = Object.assign({}, baseResponse);

	responseObject.text = data.text;

	if(data.image) {
		responseObject.attachments = getImageAttachment(data.image);
	}

	// Required names for slack
	/*eslint-disable camelcase */
	responseObject.response_type = (!data.isPrivate ? RESPONSE_PUBLIC : RESPONSE_PRIVATE);
	/*eslint-enable camelcase */

	return responseObject;
}

function getImageAttachment(image) {
	// Required names for slack
	/*eslint-disable camelcase */
	return [{
		image_url: image
	}];
	/*eslint-enable camelcase */
}

function convertCardToResponse(card) {
	let responseData = {
		text:      populateTemplate(card),
		image:     card.image,
		isPrivate: false
	};

	return createResponseObject(responseData);
}

function handleMultipleCards(foundCards, query) {
	let cardString = foundCards.reduce(populateMultipleCardTemplate);

	return createResponseObject({
		text:      `I found more than one card matching *'${query.text}'*:${cardString}`,
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

function formatSearch(term) {
	// Make sure we only compare in lowercase
	term       = term.toLowerCase();
	let filter = parseFilters(term);
	// Strip the filter string from the search text
	term       = term.replace(FILTER_REGEX, '').trim();

	return {
		term,
		filter
	};
}

function handleGoodRequest(query) {
	const search      = formatSearch(query.text);
	const foundCards  = findCard(search);
	const resultCount = foundCards.length;

	if(resultCount === 0) {
		return createResponseObject({
			text:      `Sorry i couldn't find a card for *'${query.text}'*`,
			isPrivate: true
		});
	} else if(resultCount === 1) {
		return convertCardToResponse(foundCards[0]);
	} else {
		return handleMultipleCards(foundCards, query);
	}
}

function handleBadRequest() {
	return 'There was an error with the request';
}

module.exports = async function BaseHandler(req, res) {
	const query = qs.parse(url.parse(req.url).query);

	if(!query.text) {
		send(res, 200, handleBadRequest(query));
	} else {
		send(res, 200, handleGoodRequest(query));
	}

}
