const emojiMap = {
	'bank left':          'bankleft',
	'bank right':         'bankright',
	'barrel roll':        'barrelroll',
	boost:                'boost',
	bomb:                 'xbomb',
	cannon:               'cannon',
	cargo:                'cargo',
	cloak:                'cloak',
	crew:                 'crew',
	'critical hit':       'crit',
	elite:                'elite',
	energy:               'energy',
	evade:                'evade',
	focus:                'focus',
	hit:                  'hit',
	illicit:              'illicit',
	kturn:                'kturn',
	missile:              'missile',
	modification:         'modification',
	'salvaged astromech': 'salvaged',
	slam:                 'slam',
	stop:                 'stop',
	straight:             'straight',
	system:               'system',
	'target lock':        'targetlock',
	team:                 'team',
	tech:                 'tech',
	torpedo:              'torpedo',
	't roll left':        'trollleft',
	't roll right':       'trollright',
	'turn left':          'turnleft',
	'turn right':         'turnright',
	turret:               'turret'
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
