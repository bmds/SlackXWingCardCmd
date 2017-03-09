const validIdData = {
	id:     4,
	image:  'https://r2-f2.png',
	key:    'r2-f2',
	name:   'R2-F2',
	points: 3,
	slot:   'astromech',
	text:   'shorter',
	unique: true,
	xws:    'r2f2'
};

const validCardData = {
	name:   'Autothrusters',
	key:    'autothrusters',
	id:     188,
	slot:   'Modification',
	points: 2,
	text:   'When defending',
	image:  'http://upgrades/Modification/autothrusters.png',
	xws:    'autothrusters'
};

function makeSnapshot(data) {
	return {
		val: () => data
	};
}

function mockChild(cardId) {
	return {
		once: () => {
			if(cardId === '4u') {
				return Promise.resolve(makeSnapshot(validIdData));
			} else {
				return Promise.resolve(false);
			}
		}
	};
}

function cardData() {
	return [ validCardData ];
}

function slotData() {
	return {
		astromech:            1,
		bomb:                 1,
		cannon:               1,
		cargo:                1,
		condition:            1,
		crew:                 1,
		elite:                1,
		hardpoint:            1,
		illicit:              1,
		missile:              1,
		modification:         1,
		pilot:                1,
		'salvaged astromech': 1,
		system:               1,
		team:                 1,
		tech:                 1,
		title:                1,
		torpedo:              1,
		turret:               1
	};
}

module.exports = {
	hello: true,
	refs: {
		cards: {
			child: mockChild
		}
	},
	cards: {
		data: () => [validCardData]
	},
	slots: {
		data: slotData
	}
};

module.exports.testData = {
	validIdData,
	validCardData
};
