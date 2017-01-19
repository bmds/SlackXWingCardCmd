const request   = require('request-promise');
const utilities = require('./utilities');

const REPO_BASE      = 'https://raw.githubusercontent.com/guidokessels/xwing-data/master';
const UPGRADE_SOURCE = `${REPO_BASE}/data/upgrades.js`;
const PILOT_SOURCE   = `${REPO_BASE}/data/pilots.js`;
const IMAGE_BASE     = `${REPO_BASE}/images/`;

const headers = {
	'User-Agent': 'SlackXWingCardCmd'
};

let firebase;
let slots = {};

function slackifyText(text) {
	text = text.replace(/(<\/*(strong|b)>)+/g, '*');
	text = text.replace(/(<\/*(em|i)>)+/g, '_');
	text = text.replace(/(<br \/>)+/g, '\n');

	return text;
}

function addSlot(slot) {
	if(!slots[slot]) {
		slots[slot] = 1;
	}
}

function processCard(card) {
	card.key   = card.name.toLowerCase();
	card.image = IMAGE_BASE + card.image;

	card.text   = (card.text ? slackifyText(card.text) : '');
	card.effect = (card.effect ? slackifyText(card.effect) : '');
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

	addSlot(card.slot);

	return card;
}

function processPilotCard(card) {
	card = processCard(card);

	card.slot = 'pilot';

	// Removed to make equality comparisons easier
	delete card.slots;
	delete card.conditions;
	delete card.ship_override;

	addSlot(card.slot);

	return card;
}

function filterUnmodifiedCard(card, existing) {
	let identifier = utilities.cardId(card);

	return !existing.hasOwnProperty(identifier) || !utilities.checkEquality(existing[identifier], card);
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

function saveCards(cards) {
	let cardCount = Object.getOwnPropertyNames(cards).length;

	if(cardCount) {
		return firebase.refs.cards.update(cards)
			.then(() => cardCount);
	}
	return Promise.resolve(0);
}

function handleError(error) {
	console.log(`Import operation failed with (${error}).`);
}

function importData(existingCards) {
	return Promise.all([
		importUpgrades(existingCards),
		importPilots(existingCards)
	])
		.then((cardGroups) => cardGroups[0].concat(cardGroups[1]))
		.then((cards) => utilities.arrayToObject(cards, utilities.cardId))
		.then(saveCards)
		.catch(handleError);
}

function getExistingData() {
	return new Promise((resolve) => {
		resolve(firebase.cards.raw());
	})
		.then((cards) => typeof cards === 'object' ? cards : {})
}

function saveSlots() {
	return firebase.refs.slots.update(slots);
}

module.exports.setDb = function setDb(db) {
	firebase = db;
}

module.exports.run = function run() {
	let updatedCards = 0;

	return getExistingData()
		.then(importData)
		.then(function endOfWork(updated) {
			updatedCards = updated;
			return updated;
		})
		.then(saveSlots)
		.then(() => `Finished import ${updatedCards} cards were updated`);
};
