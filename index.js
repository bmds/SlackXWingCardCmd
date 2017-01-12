const { send } = require('micro');
const qs       = require('querystring');
const url      = require('url');
const db       = require('./db');

function findCard(queryString) {
	return db.cards.filter((card) => queryString === card.name);
}

function convertCardToResponse(card) {
	return `${card.name} (${card.type}) - ${card.cost}pt${card.cost > 1 ? 's': ''}
${card.text}
${card.image}`;
}

module.exports = async function (req, res) {
	const query       = qs.parse(url.parse(req.url).query);
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
