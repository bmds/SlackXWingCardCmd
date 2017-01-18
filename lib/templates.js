const utilities = require('./utilities');

const limited   = (card) => card.limited ? ' | limited' : '';
const unique    = (card) => card.unique ? ' | unique' : '';
const points    = (card) => `${card.points}pt${card.points > 1 ? 's': ''}`;
const multiCard = (card) => `\n• ${card.name} (${card.slot}) use \`/card ${card.name} (${card.slot})\` or \`/card #id ${utilities.cardId(card)}\``;

function cardReduce(currentString, card) {
	if(typeof currentString === 'object') {
		currentString = cardReduce('', currentString);
	}

	return currentString + multiCard(card);
}

const templates = {
	// Template for a single card
	card: (card) => `${card.name} (${card.slot}${limited(card)}${unique(card)}): ${points(card)}\n${card.text}`,

	// Template for multiple cards
	multiple: (cards, query) => {
		let cardString = cards.reduce(cardReduce);

		return `I found more than one card matching *'${query.text}'*:${cardString}`;
	},

	// Template for no results
	notFound: (query) => `Sorry i couldn't find a card for *'${query.text}'*`
};

module.exports = templates;