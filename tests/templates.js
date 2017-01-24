import test from 'ava';
import {card, multiple, notFound} from '../lib/templates';

test('not found', async t => {
	let text = 'cheese';

	t.is(`Sorry i couldn't find a card for *'${text}'*`, notFound({text}));
});

test('multiple', async t => {
	let cards = [
		{ name: 'Autoblaster Turret', slot: 'turret', id: 116 },
		{ name: 'Autothrusters', slot: 'modification', id: 188 },
		{ name: 'Automated Protocols', slot: 'modification', id: 202 },
		{ name: 'Autoblaster', slot: 'cannon', id: 35 }
	];

	let response = `I found more than one card matching *'auto'*:
• *Autoblaster Turret* (turret) use \`/card Autoblaster Turret (turret)\` or \`/card #id 116u\`
• *Autothrusters* (modification) use \`/card Autothrusters (modification)\` or \`/card #id 188u\`
• *Automated Protocols* (modification) use \`/card Automated Protocols (modification)\` or \`/card #id 202u\`
• *Autoblaster* (cannon) use \`/card Autoblaster (cannon)\` or \`/card #id 35u\``;

	t.is(response, multiple(cards, {text: 'auto'}));
});

test('single card', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 3,
		text:   'Some text'
	};

	t.is(`R2-F2 (astromech): 3pts\nSome text`, card(cardData));
});

test('single card - limited', async t => {
	let cardData = {
		name:    'R2-F2',
		slot:    'astromech',
		points:  3,
		text:    'Some text',
		limited: true
	};

	t.is(`R2-F2 (astromech | limited): 3pts\nSome text`, card(cardData));
});

test('single card - unique', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 3,
		text:   'Some text',
		unique: true
	};

	t.is(`R2-F2 (astromech | unique): 3pts\nSome text`, card(cardData));
});

test('single card - 1 point', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 1,
		text:   'Some text'
	};

	t.is(`R2-F2 (astromech): 1pt\nSome text`, card(cardData));
});

test('single card - 0 points', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 0,
		text:   'Some text'
	};

	t.is(`R2-F2 (astromech): 0pts\nSome text`, card(cardData));
});

test('single card - with effect', async t => {
	let cardData = {
		name:   'Proton Bombs',
		slot:   'bomb',
		points: 5,
		text:   'description text',
		effect: 'effect text'
	};

	let output = `Proton Bombs (:xbomb: bomb): 5pts
description text
> effect text`;

	t.is(output, card(cardData));
});

test('single card - undefined points', async t => {
	let cardData = {
		name:   'Fanatical Devotion',
		slot:   'condition',
		text:   'Some text'
	};

	t.is(`Fanatical Devotion (condition): \nSome text`, card(cardData));
});
