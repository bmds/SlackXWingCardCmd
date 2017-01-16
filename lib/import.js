const request  = require('request-promise');
const firebase = require('./firebase');

const REPO_BASE      = 'https://raw.githubusercontent.com/guidokessels/xwing-data/master';
const UPGRADE_SOURCE = `${REPO_BASE}/data/upgrades.js`;
const PILOT_SOURCE   = `${REPO_BASE}/data/pilots.js`;
const IMAGE_BASE     = `${REPO_BASE}/images/`;

const headers = {
	'User-Agent': 'SlackXWingCardCmd'
};

function slackifyText(text) {
	text = text.replace(/(<\/*(strong|b)>)+/g, '*');
	text = text.replace(/(<\/*(em|i)>)+/g, '_');
	text = text.replace(/(<br \/>)+/g, '\n');

	return text;
}

function cardIdentifier(card) {
	return card.xws + card.id;
}

function processCard(card) {
	card.key   = card.name.toLowerCase();
	card.image = IMAGE_BASE + card.image;

	card.text = (card.text ? slackifyText(card.text) : '');
	return card;
}

function processUpgradeCard(card) {
	card = processCard(card);

	card.slot  = card.slot.toLowerCase();

	// Removed to make equality comparisons easier
	delete card.ship;
	delete card.conditions;
	delete card.size;
	delete card.grants;

	return card;
}

function processPilotCard(card) {
	card = processCard(card);

	card.slot = 'pilot';

	// Removed to make equality comparisons easier
	delete card.slots;
	delete card.conditions;
	delete card.ship_override;

	return card;
}

function checkCardEquality(existingCard, updatedCard) {
	// Create arrays of property names
	const existingCardProps = Object.getOwnPropertyNames(existingCard);
	const updatedCardProps  = Object.getOwnPropertyNames(updatedCard);
	const propLength        = updatedCardProps.length;

	// If number of properties is different,
	// objects are not equivalent
	if (propLength !== existingCardProps.length) {
		return false;
	}

	for (let i = 0; i < propLength; i++) {
		let propName = existingCardProps[i];

		// If values of same property are not equal,
		// objects are not equivalent
		if (existingCard[propName] !== updatedCard[propName]) {
			return false;
		}
	}

	// If we made it this far, objects
	// are considered equivalent
	return true;
}

function filterUnmodifiedCard(card, existing) {
	let identifier = cardIdentifier(card);

	return !existing.hasOwnProperty(identifier) || !checkCardEquality(existing[identifier], card);
}

function filterUpdatedCards(existing, updated) {
	return updated.filter((card) => filterUnmodifiedCard(card, existing));
}

function importRemoteSource(source) {
	return request.get({
		url: source,
		headers: headers
	})
		.then((body) => JSON.parse(body));
}

function importCards(existingCards, source, processFunction) {
	return importRemoteSource(source)
		.then((cards) => cards.map(processFunction))
		.then((cards) => filterUpdatedCards(existingCards, cards));
}

function importUpgrades(existingCards) {
	return importCards(existingCards, UPGRADE_SOURCE, processUpgradeCard);
}

function importPilots(existingCards) {
	return importCards(existingCards, PILOT_SOURCE, processPilotCard);
}

function convertToObject(cards) {
	if(cards.length) {
		return cards.reduce((theObject, card) => {
			theObject[cardIdentifier(card)] = card;
			return theObject;
		}, {});
	}

	return {};
}

function saveCards(cards) {
	// return cards;
	if(Object.getOwnPropertyNames(cards).length) {
		return firebase.cards.update(cards);
	}
	return Promise.resolve('Nothing up update');
}

function handleError(error) {
	console.log(`Import operation failed with (${error}).`);
}

function importData(existingCards) {
	return Promise.all([importUpgrades(existingCards), importPilots(existingCards)])
		.then((cardGroups) => cardGroups[0].concat(cardGroups[1]))
		.then(convertToObject)
		.then(saveCards)

		// .then((cards) => JSON.stringify(cards))
		// .then((cards) => fs.writeFile('lib/data.json', cards))
		.catch(handleError);
}

function getExistingData() {
	return firebase.cards
		.once('value')
		.then((cards) => cards.val())
		.then((cards) => typeof cards === 'object' ? cards : {})
}

getExistingData()
	.then(importData)
	.then(function endOfWork() {
		console.log('Finished import');
	});
