const debug        = require('debug')('gonk');

const search       = require('../app/search');
const queryParser  = require('../src/queryParser');
const firebase     = require('../src/firebase');
const slackMessage = require('../src/slackMessage');
const templates    = require('../src/templates');
const utilities    = require('../src/utilities');

const MESSAGES = {
	searching: 'Searching for your card',
	empty:     'You need to give me something to search for'
};

function convertCardToResponse(card, isPrivate) {
	let responseData = {
		text:      templates.card(card),
		image:     card.image,
		isPrivate
	};

	return slackMessage(responseData);
}

function cardAction(card) {
	return {
		name: 'id',
		text: templates.action(card),
		type: 'button',
		value: utilities.cardId(card)
	};
}

function handleMultipleCards(foundCards, query) {
	const responseText = templates.multiple(query);

	return {
		text: '',
		attachments: [{
			text:        responseText,
			fallback:    responseText,
			callback_id: 'multipule_card_result_callback',
			actions:     foundCards.map(cardAction)
		}]
	};
}

function handleNotFound(searchString) {
	return slackMessage({
		text:      templates.notFound(searchString),
		isPrivate: true
	});
}

function handleSearchResponse(cards, searchString, query) {
	const resultCount = cards.length;

	if(resultCount === 0) {
		return handleNotFound(searchString);
	} else if(resultCount === 1) {
		return convertCardToResponse(cards[0], query.isPrivate);
	} else {
		return handleMultipleCards(cards, searchString);
	}
}

function runSearch(searchString, msg) {
	const query = queryParser.format(searchString, firebase.slots.data);

	msg.say(MESSAGES.searching);
	search.byText(query)
		.then((cards) => handleSearchResponse(cards, searchString, query))
		.then((message) => {
			msg
				.say(message)
				.route('handleChosenId', {}, 60);
		});
}

function handleSearch(cardString, msg) {
	if(cardString.length) {
		runSearch(cardString, msg);
	} else {
		msg.say(MESSAGES.empty);
	}
}

module.exports = function main(slapp) {

	slapp.message('card (.*)', ['direct_mention', 'direct_message'], (msg, text, cardString) => {
		debug(`message: ${cardString}`);

		handleSearch(cardString, msg);
	});

	slapp.command('/card', (msg, text) => {
		debug(`command: ${text}`);

		handleSearch(text, msg);
	});

	slapp.route('handleChosenId', (msg, state) => {
		// if they respond with anything other than a button selection,
		// get them back on track
		if (msg.type !== 'action') {
			msg
				.say('Please choose card from the list :wink:')
				.route('handleChosenId', state, 60);
			return;
		}

		search.byId(msg.body.actions[0].value)
			.then((card) => convertCardToResponse(card[0]))
			.then((message) => msg.respond(message));
	});
};
