const fs      = require('mz/fs');
const request = require('request-promise');

const REPO_BASE      = 'https://raw.githubusercontent.com/guidokessels/xwing-data/master';
const UPGRADE_SOURCE = `${REPO_BASE}/data/upgrades.js`;
const IMAGE_BASE     = `${REPO_BASE}/images/`;

const headers = {
	'User-Agent': 'SlackXWingCardCmd'
};

function slackifyText(text) {
	text = text.replace(/(<\/*strong>)+/g, '*');
	text = text.replace(/(<br \/>)+/g, '\n');

	return text;
}

function processUpgradeCard(card) {
	card.key   = card.name.toLowerCase();
	card.slot  = card.slot.toLowerCase();
	card.image = IMAGE_BASE + card.image;

	card.text = slackifyText(card.text);
	return card;
}

function importUpgrades() {
	return request.get({
		url: UPGRADE_SOURCE,
		headers: headers
	})
		.then((body) => JSON.parse(body))
		.then((body) => body.map(processUpgradeCard));
}

function importData() {

	return importUpgrades()
		.then((cards) => JSON.stringify(cards))
		.then((cards) => fs.writeFile('lib/data.json', cards));
}

importData();
