function acronym(text, minWords = 2) {
	const words = text.split(/\s/);

	if(words.length >= minWords) {
		return words.reduce(
			(accumulator, word) => accumulator + word.charAt(0).toLowerCase(),
			''
		);
	}

	return false;
}

function astromech(text) {
	return (text.includes('-') ? [text.replace('-', '')] : false);
}

function system(text) {
	const acc = acronym(text.replace('-', ' '));

	return (acc ? [acc] : acc);
}

function turret(text) {
	const acc = acronym(text, 3);

	return (acc ? [acc] : acc);
}

const slotMap = {
	astromech,
	system,
	turret
};

module.exports.generate = function generate(text, slot) {
	if(slotMap.hasOwnProperty(slot)) {
		return slotMap[slot](text);
	}

	return false;
}

// testing exports
module.exports._astromech = astromech;
module.exports._system    = system;
module.exports._turret    = turret;
module.exports._acronym   = acronym;
