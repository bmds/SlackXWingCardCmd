import test from 'ava';
import {card, multiple, notFound} from '../src/templates';

test('not found', async t => {
	let text = 'cheese';

	t.is(`Sorry i couldn't find a card for *'${text}'*`, notFound({text}));
});

test('multiple', async t => {
	let response = `I found more than one card matching *'auto'*`;

	t.is(response, multiple({text: 'auto'}));
});

test('single card', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 3,
		text:   'Some text'
	};

	t.is(`R2-F2 (:astromech:): 3pts\nSome text`, card(cardData));
});

test('single card - limited', async t => {
	let cardData = {
		name:    'R2-F2',
		slot:    'astromech',
		points:  3,
		text:    'Some text',
		limited: true
	};

	t.is(`R2-F2 (:astromech: | limited): 3pts\nSome text`, card(cardData));
});

test('single card - unique', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 3,
		text:   'Some text',
		unique: true
	};

	t.is(`R2-F2 (:astromech: | unique): 3pts\nSome text`, card(cardData));
});

test('single card - 1 point', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 1,
		text:   'Some text'
	};

	t.is(`R2-F2 (:astromech:): 1pt\nSome text`, card(cardData));
});

test('single card - 0 points', async t => {
	let cardData = {
		name:   'R2-F2',
		slot:   'astromech',
		points: 0,
		text:   'Some text'
	};

	t.is(`R2-F2 (:astromech:): 0pts\nSome text`, card(cardData));
});

test('single card - with effect', async t => {
	let cardData = {
		name:   'Proton Bombs',
		slot:   'bomb',
		points: 5,
		text:   'description text',
		effect: 'effect text'
	};

	let output = `Proton Bombs (:xbomb:): 5pts
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
