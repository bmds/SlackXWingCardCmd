const request       = require('request-promise');
const deepEqual     = require('deep-equal');
const utilities     = require('./utilities');
const cardProcessor = require('./cardProcessor');

const REPO_BASE        = 'https://raw.githubusercontent.com/guidokessels/xwing-data/master';
const UPGRADE_SOURCE   = `${REPO_BASE}/data/upgrades.js`;
const PILOT_SOURCE     = `${REPO_BASE}/data/pilots.js`;
const CONDITION_SOURCE = `${REPO_BASE}/data/conditions.js`;
const IMAGE_BASE       = `${REPO_BASE}/images/`;

const headers = {
	'User-Agent': 'SlackXWingCardCmd'
};

let firebase;
let slots = {};

function addSlot(slot) {
	if(!slots[slot]) {
		slots[slot] = 1;
	}
}

function filterUnmodifiedCard(card, existing) {
	let identifier = utilities.cardId(card);

	return !existing.hasOwnProperty(identifier) || !deepEqual(existing[identifier], card);
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

function addSlotsFromCards(cards) {
	cards.forEach((card) => addSlot(card.slot));
	return cards;
}

function importCards(existingCards, source, processFunction) {
	return importRemoteSource(source)
		.then((cards) => cards.map((card) => processFunction(card, IMAGE_BASE)))
		.then(addSlotsFromCards)
		.then((cards) => filterUpdatedCards(existingCards, cards));
}

function importUpgrades(existingCards) {
	return importCards(existingCards, UPGRADE_SOURCE, cardProcessor.upgrade);
}

function importPilots(existingCards) {
	return importCards(existingCards, PILOT_SOURCE, cardProcessor.pilot);
}

function importConditions(existingCards) {
	return importCards(existingCards, CONDITION_SOURCE, cardProcessor.condition);
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
		importPilots(existingCards),
		importConditions(existingCards)
	])
		.then((cardGroups) => cardGroups[0].concat(cardGroups[1], cardGroups[2]))
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
