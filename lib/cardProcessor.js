function slackifyText(text) {
	text = text.replace(/(<\/*(strong|b)>)+/g, '*');
	text = text.replace(/(<\/*(em|i)>)+/g, '_');
	text = text.replace(/(<br \/>)+/g, '\n');

	return text;
}

function processCard(card, imageBase) {
	card.key   = card.name.toLowerCase();
	card.image = imageBase + card.image;
	card.text  = (card.text ? slackifyText(card.text) : '');

	if(card.effect) {
		card.effect = (card.effect ? slackifyText(card.effect) : '');
	}

	return card;
}

module.exports.upgrade = function upgrade(card, imageBase) {
	card = processCard(card, imageBase);

	card.slot  = card.slot.toLowerCase();

	// Removed to make equality comparisons easier
	delete card.ship;
	delete card.conditions;
	delete card.size;
	delete card.grants;

	return card;
}

module.exports.pilot = function pilot(card, imageBase) {
	card = processCard(card, imageBase);

	card.slot = 'pilot';

	// Removed to make equality comparisons easier
	delete card.slots;
	delete card.conditions;
	delete card.ship_override;

	return card;
}

module.exports.condition = function condition(card, imageBase) {
	card = processCard(card, imageBase);

	card.slot = 'condition';

	return card;
}

// Export for unit testing
module.exports._processCard  = processCard;
module.exports._slackifyText = slackifyText;
