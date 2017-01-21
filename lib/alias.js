function astromech(text) {
	let alias = [];

	if(text.includes('-')) {
		alias.push(text.replace('-', ''));
	}

	return (alias.length > 0 ? alias : false);
}

module.exports.generate = function generate(text, slot) {
	if(slot === 'astromech') {
		return astromech(text);
	}

	return false;
}

// testing exports
module.exports._astromech = astromech;
