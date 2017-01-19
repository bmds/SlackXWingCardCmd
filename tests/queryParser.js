import test from 'ava';
import {format, _parseFags, _parseSlots, _formatSlots} from '../lib/queryParser';

function slotData() {
	return [
		'cannon',
		'salvaged astromech'
	];
}

test('format slot', async t => {
	t.is('salvaged astromech', _formatSlots('(salvaged astromech)', slotData));
});

test('format slot - Invalid', async t => {
	t.is('', _formatSlots('(mod)', slotData));
});

test('parse slot', async t => {
	t.deepEqual(['cannon'], _parseSlots('(cannon)', slotData));
});

test('parse slot - non valid', async t => {
	t.is(false, _parseSlots('(hat)', slotData));
});

test('parse flag - id', async t => {
	t.deepEqual(['id'], _parseFags('#id 4u', slotData));
});

test('parse flag - quiet', async t => {
	t.deepEqual(['quiet'], _parseFags('autothrusters #quiet', slotData));
});

test('parse flag - quiet and id', async t => {
	t.deepEqual(['id', 'quiet'], _parseFags('#id 4u #quiet', slotData));
});

test('parse flag - invalid', async t => {
	t.is(false, _parseFags('autothrusters #mega', slotData));
});

test('format', async t => {
	t.deepEqual(format('autothrusters', slotData), {
		term:      'autothrusters',
		slot:      false,
		isPrivate: false,
		isId:      false
	});
});

test('format - mixed case', async t => {
	t.deepEqual(format('AutoThrusters', slotData), {
		term:      'autothrusters',
		slot:      false,
		isPrivate: false,
		isId:      false
	});
});

test('format - additional whitespace', async t => {
	t.deepEqual(format('  autothrusters  ', slotData), {
		term:      'autothrusters',
		slot:      false,
		isPrivate: false,
		isId:      false
	});
});

test('format - quiet', async t => {
	t.deepEqual(format('autothrusters #quiet', slotData), {
		term:      'autothrusters',
		slot:      false,
		isPrivate: true,
		isId:      false
	});
});

test('format - has id', async t => {
	t.deepEqual(format('#id 4u', slotData), {
		term:      '4u',
		slot:      false,
		isPrivate: false,
		isId:      true
	});
});

test('format - has id and is quiet', async t => {
	t.deepEqual(format('#id 4u #quiet', slotData), {
		term:      '4u',
		slot:      false,
		isPrivate: true,
		isId:      true
	});
});

test('format - has filter', async t => {
	t.deepEqual(format('auto (cannon)', slotData), {
		term:      'auto',
		slot:      ['cannon'],
		isPrivate: false,
		isId:      false
	});
});

test('format - invalid filter', async t => {
	t.deepEqual(format('auto (peeler)', slotData), {
		term:      'auto',
		slot:      false,
		isPrivate: false,
		isId:      false
	});
});
