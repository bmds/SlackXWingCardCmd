import test from 'ava';
import {arrayToObject, cardId} from '../lib/utilities';

// Card ID tests
test('card id pilot', async t => {
	let response = cardId({
		id:   12,
		slot: 'pilot'
	});

	t.is(response, '12p');
});

test('card id condition', async t => {
	let response = cardId({
		id:   0,
		slot: 'condition'
	});

	t.is(response, '0c');
});

test('card id modification', async t => {
	let response = cardId({
		id:   256,
		slot: 'modification'
	});

	t.is(response, '256u');
});

test('card id unknown', async t => {
	let response = cardId({
		id:   10,
		slot: 'hat'
	});

	t.is(response, '10u');
});

test('array to object', async t => {
	let baseArr = [
		{ id: 'one',text: 'cats' },
		{ id: 'two',text: 'in' },
		{ id: 'three',text: 'hats' }
	];
	let response = arrayToObject(baseArr, (element) => element.id);

	t.deepEqual(response, {
		one:   { id: 'one',text: 'cats' },
		two:   { id: 'two',text: 'in' },
		three: { id: 'three',text: 'hats' }
	});
});
