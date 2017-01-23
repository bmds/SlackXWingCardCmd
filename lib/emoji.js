const emojiMap = {
	'[barrel roll]':  'barrelroll',
	'[boost]':        'boost',
	'[bomb]':         'xbomb',
	'[crew]':         'crew',
	'[critical hit]': 'crit',
	'[elite]':        'elite',
	'[evade]':        'evade',
	'[focus]':        'focus',
	'[hit]':          'hit',
	'[missile]':      'missile',
	'[system]':       'system',
	'[target lock]':  'targetlock',
	'[torpedo]':      'torpedo'
};

function handleReplace(match) {
	const key = match.toLowerCase();

	if(emojiMap[key]) {
		return `:${emojiMap[key]}:`;
	}

	return match;
}

module.exports.replace = function replace(text) {
	return text.replace(/\[[\w\s]+\]/ig, handleReplace);
}
