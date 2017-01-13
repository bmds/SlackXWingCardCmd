const fs = require('fs');

const DATA_SOURCE = 'node_modules/xwing-data/data/upgrades.js';
const REPO_BASE   = 'https://raw.githubusercontent.com/guidokessels/xwing-data/master';
const IMAGE_BASE  = `${REPO_BASE}/images/`;

function slackifyText(text) {
	text = text.replace(/(<\/*strong>)+/g, '*');
	text = text.replace(/(<br \/>)+/g, '\n');

	return text;
}

function processCard(card) {
	card.key   = card.name.toLowerCase();
	card.slot  = card.slot.toLowerCase();
	card.image = IMAGE_BASE + card.image;

	card.text = slackifyText(card.text);
	return card;
}

fs.readFile(DATA_SOURCE, (err, data) => {
	if (err) throw err;
	let cardData = JSON.parse(data).map(processCard);

	fs.writeFile('lib/data.json', JSON.stringify(cardData), (err) => {
		if (err) throw err;
	});
});
