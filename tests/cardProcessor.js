import test from 'ava';
import {upgrade, pilot, condition, _processCard, _slackifyText} from '../src/cardProcessor';

test('slackify - simple string', async t => {
	const testText = 'You may treat all 1- and 2-speed maneuvers as green maneuvers.';
	t.is(testText, _slackifyText(testText));
});

test('slackify - with strong', async t => {
	t.is(
		'*Attack:* Attack 1 ship Then cancel *all* dice results.',
		_slackifyText('<strong>Attack:</strong> Attack 1 ship Then cancel <strong>all</strong> dice results.')
	);
});

test('slackify - with em', async t => {
	t.is(
		'the _Nastah Pup_ Pilot',
		_slackifyText('the <em>Nastah Pup</em> Pilot')
	);
});

test('slackify - with b', async t => {
	t.is(
		'*Attack:* Attack 1 ship. If this attack hits',
		_slackifyText('<b>Attack:</b> Attack 1 ship. If this attack hits')
	);
});

test('slackify - with i', async t => {
	t.is(
		'While you are docked, the _Ghost_ can perform [Turret].',
		_slackifyText('While you are docked, the <i>Ghost</i> can perform [Turret].')
	);
});

test('slackify - with linebreak', async t => {
	t.is(
		'Roll 1 defense die.\nOn a [Evade] or [Focus]',
		_slackifyText('Roll 1 defense die.<br /><br />On a [Evade] or [Focus]')
	);
});

test('slackify - complex string', async t => {
	t.is(
		'After you are *destroyed*, before you are [removed] from the \'play area\', you may *deploy* the _Nastah Pup_ Pilot.\nIt _cannot_ attack this round.',
		_slackifyText('After you are <b>destroyed</b>, before you are [removed] from the \'play area\', you may <strong>deploy</strong> the <em>Nastah Pup</em> Pilot.<br /><br />It <i>cannot</i> attack this round.')
	);
});

test('process - basic', async t => {
	const testData = {
		name:   'R2 Astromech',
		id:     2,
		slot:   'Astromech',
		points: 1,
		text:   'You may treat <strong>all</strong> 1- and 2-speed maneuvers<br /> as green maneuvers.',
		image:  'upgrades/Astromech/r2-astromech.png',
		xws:    'r2astromech'
	};

	t.deepEqual(
		{
			name:   'R2 Astromech',
			key:    'r2 astromech',
			id:     2,
			slot:   'Astromech',
			points: 1,
			text:   'You may treat *all* 1- and 2-speed maneuvers\n as green maneuvers.',
			image:  'http://upgrades/Astromech/r2-astromech.png',
			xws:    'r2astromech'
		},
		_processCard(testData, 'http://')
	);
});

test('process - no text', async t => {
	const testData = {
		name:   'R2 Astromech',
		id:     2,
		slot:   'Astromech',
		points: 1,
		image:  'upgrades/Astromech/r2-astromech.png',
		xws:    'r2astromech'
	};

	t.is('', _processCard(testData, '')['text']);
});

test('process - no text', async t => {
	const testData = {
		name:   'Seismic Charges',
		id:     24,
		slot:   'Bomb',
		points: 2,
		text:   'some text',
		effect: 'other <strong>text</strong>',
		image:  'upgrades/Bomb/seismic-charges.png',
		xws:    'seismiccharges'
	};

	t.is('other *text*', _processCard(testData, '')['effect']);
});

test('upgrade - basic', async t => {
	const testData = {
		name:   'Crack Shot',
		id:     141,
		slot:   'Elite',
		points: 1,
		text:   'When attacking a ship inside your firing arc',
		image:  'upgrades/Elite/crack-shot.png',
		xws:    'crackshot'
	};

	t.deepEqual(
		{
			name:   'Crack Shot',
			key:    'crack shot',
			id:     141,
			slot:   'elite',
			points: 1,
			text:   'When attacking a ship inside your firing arc',
			image:  'http://upgrades/Elite/crack-shot.png',
			xws:    'crackshot',
			alias:  false
		},
		upgrade(testData, 'http://')
	);
});

test('upgrade - alias', async t => {
	const testData = {
		name:   'BB-8',
		key:    'bb-8',
		id:     144,
		unique: true,
		slot:   'Astromech',
		points: 2,
		text:   'When you reveal a green maneuver, you may perform a free barrel roll action.',
		image:  'upgrades/Astromech/bb-8.png',
		xws:    'bb8'
	};

	t.deepEqual(
		{
			name: 'BB-8',
			key: 'bb-8',
			id: 144,
			unique: true,
			slot:   'astromech',
			points: 2,
			text:   'When you reveal a green maneuver, you may perform a free barrel roll action.',
			image:  'http://upgrades/Astromech/bb-8.png',
			xws:    'bb8',
			alias:  ['bb8']
		},
		upgrade(testData, 'http://')
	);
});

test.todo('upgrade - has ship');
test.todo('upgrade - has conditions');
test.todo('upgrade - has size');
test.todo('upgrade - has grants');

test.todo('pilot - basic');
test.todo('pilot - has slots');
test.todo('pilot - has conditions');
test.todo('pilot - has ship_override');

test('condition - basic', async t => {
	const testData = {
		image:  'conditions/a-debt-to-pay.png',
		text:   `When attacking a ship that has the \"A Score to Settle\" Upgrade card, you may change 1 [Focus] result to a [Critical Hit] result.`,
		name:   'A Debt to Pay',
		xws:    'adebttopay',
		unique: true,
		id:     3
	};

	t.is('condition', condition(testData, '')['slot']);
});
