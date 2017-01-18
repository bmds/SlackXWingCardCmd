const fs      = require('mz/fs');
const request = require('request-promise');

const REPO_BASE      = 'https://raw.githubusercontent.com/guidokessels/xwing-data/master';
const UPGRADE_SOURCE = `${REPO_BASE}/data/upgrades.js`;
const PILOT_SOURCE   = `${REPO_BASE}/data/pilots.js`;
const IMAGE_BASE     = `${REPO_BASE}/images/`;

const headers = {
	'User-Agent': 'SlackXWingCardCmd'
};

function slackifyText(text) {
	text = text.replace(/(<\/*strong>)+/g, '*');
	text = text.replace(/(<\/*em>)+/g, '_');
	text = text.replace(/(<br \/>)+/g, '\n');

	return text;
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

	return card;
}

function processPilotCard(card) {
	card = processCard(card);

	card.slot = 'pilot';

	return card;
}

function importRemoteSource(source) {
	return request.get({
		url: source,
		headers: headers
	})
		.then((body) => JSON.parse(body));
}

function importUpgrades() {
	return importRemoteSource(UPGRADE_SOURCE)
		.then((cards) => cards.map(processUpgradeCard));
}

function importPilots() {
	return importRemoteSource(PILOT_SOURCE)
		.then((cards) => cards.map(processPilotCard));
}

function handleError(error) {
	console.log(`Handle rejected promise (${error}) here.`);
}

function importData() {
	return Promise.all([importUpgrades(), importPilots()])
		.then((cardGroups) => cardGroups[0].concat(cardGroups[1]))
		.then((cards) => JSON.stringify(cards))
		.then((cards) => fs.writeFile('lib/data.json', cards))
		.catch(handleError);
}

importData();
