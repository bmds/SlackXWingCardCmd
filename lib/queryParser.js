const SLOT_REGEX = /\((\w)+\)/g;
const ID_REGEX     = /(#\w+)/g;

const ALLOWED_FLAGS = [
	'id',
	'quiet'
];

function formatSlots(slot, validSlots) {
	slot = slot.replace(/\(|\)/g, '')
		.trim()
		.toLowerCase();

	if(!validSlots().includes(slot)) {
		slot = '';
	}

	return slot;
}

function parseSlots(queryText, validSlots) {
	// Get any requested slots
	let slots = queryText.match(SLOT_REGEX);

	if(slots) {
		slots = slots
			.map((slots) => formatSlots(slots, validSlots))
			.filter((slot) => slot.length > 0);

		// Return the slots or false if we don't have any
		return (slots.length > 0 ? slots : false);
	}

	return false;
}

function parseFags(queryText) {
	// Get any requested filters
	let flags   = queryText.match(ID_REGEX);
	if(flags) {
		flags = flags
			.map((flag) => flag.replace('#', ''))
			.map((flag) => ALLOWED_FLAGS.includes(flag) ? flag : '')
			.filter((flag) => flag.length > 0);
		// Store if we have any after filtering
		return (flags.length > 0 ? flags : false);
	}
	return false;
}

module.exports.format = function formatSearch(term, slots) {
	// Make sure we only compare in lowercase
	term      = term.toLowerCase();
	let slot  = parseSlots(term, slots);
	let flags = parseFags(term)

	// Strip the command string from the search text
	term      = term
		.replace(SLOT_REGEX, '')
		.replace(ID_REGEX, '')
		.trim();

	return {
		term,
		slot,
		isPrivate: Array.isArray(flags) && flags.includes('quiet'),
		isId:      Array.isArray(flags) && flags.includes('id')
	};
};

// Export for unit testing
module.exports._parseFags   = parseFags;
module.exports._parseSlots  = parseSlots;
module.exports._formatSlots = formatSlots;
