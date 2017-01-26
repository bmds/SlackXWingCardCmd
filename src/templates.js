const utilities = require('./utilities');
const emoji     = require('./emoji');

const limited   = (limited) => limited ? ' | limited' : '';
const unique    = (unique) => unique ? ' | unique' : '';
const ifEmoji   = (text) => emoji.get(text) || text;
const cardIntro = (card) => `${card.name} (${ifEmoji(card.slot)}${limited(card.limited)}${unique(card.unique)}): ${points(card.points)}`;
const points    = (points) => (typeof points !== 'undefined' ? `${points}pt${points > 1 || points === 0 ? 's': ''}` : '');
const multiCard = (card) => `\n• *${card.name}* (${card.slot}) use \`/card ${card.name} (${card.slot})\` or \`/card #id ${utilities.cardId(card)}\``;
const effect    = (effect) => effect ? `\n> ${effect}` : '';

function cardReduce(currentString, card) {
	if(typeof currentString === 'object') {
		currentString = cardReduce('', currentString);
	}

	return currentString + multiCard(card);
}

const templates = {
	// Template for a single card
	card: (card) => `${cardIntro(card)}\n${card.text}${effect(card.effect)}`,

	// Template for multiple cards
	multiple: (cards, query) => {
		let cardString = cards.reduce(cardReduce);

		return `I found more than one card matching *'${query.text}'*:${cardString}`;
	},

	// Template for no results
	notFound: (query) => `Sorry i couldn't find a card for *'${query.text}'*`
};

module.exports = templates;
