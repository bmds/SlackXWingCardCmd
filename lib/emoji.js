const emojiMap = {
	'bank left':    'bankleft',
	'bank right':   'bankright',
	'barrel roll':  'barrelroll',
	boost:          'boost',
	bomb:           'xbomb',
	cannon:         'cannon',
	cargo:          'cargo',
	crew:           'crew',
	'critical hit': 'crit',
	elite:          'elite',
	evade:          'evade',
	focus:          'focus',
	hit:            'hit',
	illicit:        'illicit',
	missile:        'missile',
	slam:           'slam',
	system:         'system',
	'target lock':  'targetlock',
	team:           'team',
	torpedo:        'torpedo',
	turret:        'turret'
};

function get(text) {
	const key = text.toLowerCase();

	if(emojiMap[key]) {
		return `:${emojiMap[key]}:`;
	}

	return false;
}

function handleReplace(match, text) {
	return get(text) || match;
}

module.exports.get = get;

module.exports.replace = function replace(text) {
	return text.replace(/\[([\w\s]+)\]/ig, handleReplace);
}
