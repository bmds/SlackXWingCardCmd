const { send } = require('micro');
const qs       = require('querystring');
const url      = require('url');
const db       = require('./lib/data.json');

// Required names for slack
/*eslint-disable camelcase */
const baseResponse = {
	parse:         'full',
	response_type: 'in_channel',
	text:          '',
	attachments:   [],
	unfurl_media:  true
};
/*eslint-enable camelcase */

function findCard(queryString) {
	return db.filter((card) => queryString === card.key);
}

function populateTemplate(card) {
	return `${card.name} (${card.slot}) - ${card.points}pt${card.points > 1 ? 's': ''}
${card.text}`;
}

function convertCardToResponse(card) {
	let responseObject = Object.assign({}, baseResponse);

	// Required names for slack
	/*eslint-disable camelcase */
	responseObject.attachments = [{
		image_url: card.image
	}];
	/*eslint-enable camelcase */

	responseObject.text = populateTemplate(card);

	return responseObject;
}

function handleGoodRequest(query, res) {
	let foundCards    = findCard(query.text.toLowerCase());
	const resultCount = foundCards.length;

	if(resultCount === 0) {
		send(res, 200, `Sorry i couldn't find a card for '${query.text}'`);
	} else if(resultCount === 1) {
		send(res, 200, convertCardToResponse(foundCards[0]));
	} else {
		send(res, 200, 'more than one card');
	}
}

function handleBadRequest(res) {
	send(res, 200, 'There was an error with the request');
}

module.exports = async function BaseHandler(req, res) {
	const query = qs.parse(url.parse(req.url).query);

	if(!query.text) {
		handleBadRequest(res);
	} else {
		handleGoodRequest(query, res);
	}

}
