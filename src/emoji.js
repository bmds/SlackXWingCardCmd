const emojiMap = {
	astromech:            'astromech',
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
	's loop left':        'sloopleft',
	's loop right':       'sloopright',
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

// let inverseMap = {};

function get(text) {
	const key = text.toLowerCase();

	if(emojiMap[key]) {
		return `:${emojiMap[key]}:`;
	}

	return false;
}
// Polyfil of Object.values
function getValues(O) {
	const reduce       = Function.bind.call(Function.call, Array.prototype.reduce);
	const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
	const concat       = Function.bind.call(Function.call, Array.prototype.concat);
	const keys         = Reflect.ownKeys;
	return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
}

function isEmoji(text) {

	let regexMatch = text.match(/:([\w]+):/);

	if(Array.isArray(regexMatch)) {

		return getValues(emojiMap).includes(regexMatch[1]);
	}
	return false;
}

function handleReplace(match, text) {
	return get(text) || match;
}

module.exports.get     = get;
module.exports.isEmoji = isEmoji;

module.exports.replace = function replace(text) {
	return text.replace(/\[([\w\s]+)\]/ig, handleReplace);
}
