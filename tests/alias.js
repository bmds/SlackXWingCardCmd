import test from 'ava';
import alias from '../lib/alias';

// test('testname', async t => {
// 	t.is('bb8', alias._astromech('bb-8'));
// });

test('acronym', async t => {
	t.is('tw', alias._acronym('two words'));
});

test('acronym - min letters default', async t => {
	t.false(alias._acronym('autothrusters'));
});

test('acronym - min letters min', async t => {
	t.false(alias._acronym('two words', 3));
});

test('acronym - min letters working', async t => {
	t.is('tla', alias._acronym('three letter acronym', 3));
});

test('astromech', async t => {
	t.deepEqual(['bb8'], alias._astromech('bb-8'));
});

test('astromech - no hyphen', async t => {
	t.false(alias._astromech('r2 astromech'));
});

test('system - two word', async t => {
	t.deepEqual(['as'], alias._system('Advanced Sensors'));
});

test('system - three word', async t => {
	t.deepEqual(['atc'], alias._system('Advanced Targeting Computer'));
});

test('system - hyphen', async t => {
	t.deepEqual(['fcs'], alias._system('Fire-Control System'));
});

test('turret', async t => {
	t.deepEqual(['tlt'], alias._turret('Twin Laser Turret'));
});

test('turret - no acronym', async t => {
	t.false(alias._turret('Dorsal Turret'));
});

test('general - astromech', async t => {
	t.deepEqual(['bb8'], alias.generate('bb-8', 'astromech'));
});

test('general - system', async t => {
	t.deepEqual(['as'], alias.generate('Advanced Sensors', 'system'));
});

test('general - turret', async t => {
	t.deepEqual(['tlt'], alias.generate('Twin Laser Turret', 'turret'));
});

test('general - no map', async t => {
	t.false(alias.generate('Dorsal Turret', 'cat'));
});
