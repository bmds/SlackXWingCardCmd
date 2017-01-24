import test from 'ava';
import search from '../lib/search';

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

function makeSnapshot(data) {
	return {
		val: () => data
	};
}

function makeOnce(aPromise) {
	return {
		once: () => aPromise
	};
}

function mockChild(cardId) {
	return makeOnce(new Promise((resolve) => {
		if(cardId === '4u') {
			resolve(makeSnapshot(validIdData));
		}
	}));
}

function cardData() {
	return [
		{
			name:   'Autothrusters',
			key:    'autothrusters',
			id:     188,
			slot:   'Modification',
			points: 2,
			text:   'When defending',
			image:  'http://upgrades/Modification/autothrusters.png',
			xws:    'autothrusters'
		}
	];
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

let mockFirebase = {
	refs: {
		cards: {
			child: mockChild
		}
	},
	cards: {
		data: cardData
	},
	slots: {
		data: slotData
	}
};

function getResponseObj(text, image, isPrivate = false) {
	// Required names for slack
	/*eslint-disable camelcase */
	return {
		parse:         'full',
		text:          text,
		unfurl_media:  true,
		response_type: (isPrivate ? 'ephemeral' : 'in_channel'),
		attachments:   [{
			fallback:  'Image failed to load',
			image_url: image
		}]
	};
	/*eslint-enable camelcase */
}

test.before(t => {
	search.setDb(mockFirebase);
});

test('search - basic text', async t => {
	t.plan(1);

	return search.run({text: 'autothrusters'})
		.then(r => {
			t.deepEqual(
				getResponseObj(
					'Autothrusters (:modification: Modification): 2pts\nWhen defending',
					'http://upgrades/Modification/autothrusters.png'
				),
				r
			)
		});
});

test.todo('search - basic text - no result');
test.todo('search - basic text - quiet');

test.todo('search - basic text with pilot filter');
test.todo('search - basic text with condition filter');
test.todo('search - basic text with modification filter');
test.todo('search - basic text with filter (invalid)');

test('search - id', async t => {
	t.plan(1);

	return search.run({text: '#id 4u'})
		.then(r => {
			t.deepEqual(
				getResponseObj(
					'R2-F2 (astromech | unique): 3pts\nshorter',
					'https://r2-f2.png'
				),
				r
			);
		});
});

test('search - id - quiet', async t => {
	t.plan(1);

	return search.run({text: '#id 4u #quiet'})
		.then(r => {
			t.deepEqual(
				getResponseObj(
					'R2-F2 (astromech | unique): 3pts\nshorter',
					'https://r2-f2.png',
					true
				),
				r
			);
		});
});

test.todo('search - id (invalid)');

test.todo('search - unknown flag');

test.todo('search - multiple');
