const { send } = require('micro');
const qs       = require('querystring');
const url      = require('url');
const db       = require('./lib/data.json');

const RESPONSE_PUBLIC  = 'in_channel';
const RESPONSE_PRIVATE = 'ephemeral';

// Required names for slack
/*eslint-disable camelcase */
const baseResponse = {
	parse:         'full',
	text:          '',
	unfurl_media:  true
};
/*eslint-enable camelcase */

function findCard(queryString) {
	return db.filter((card) => card.key.includes(queryString));
}

function populateTemplate(card) {
	return `${card.name} (${card.slot}) - ${card.points}pt${card.points > 1 ? 's': ''}
${card.text}`;
}

function populateMultipleCardTemplate(currentString, card) {
	if(typeof currentString === 'object') {
		currentString = populateMultipleCardTemplate('', currentString);
	}

	return currentString + `\n• ${card.name} (${card.slot}) use \`/card ${card.name}\``;
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

function handleGoodRequest(query) {
	let foundCards    = findCard(query.text.toLowerCase());
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
