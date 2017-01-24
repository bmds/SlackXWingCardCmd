import test from 'ava';
import emoji from '../lib/emoji';

test('emoji - replace - nothing to replace', async t => {
	t.is('hey some string', emoji.replace('hey some string'));
});

test('emoji - replace - Cannon', async t => {
	t.is('While you have a :cannon: Upgrade card equipped', emoji.replace('While you have a [Cannon] Upgrade card equipped'));
});

test('emoji - replace - unknown string', async t => {
	t.is('you may change 1 of your [Potato] results to a', emoji.replace('you may change 1 of your [Potato] results to a'));
});

test('emoji - get - bank left', async t => {
	t.is(':bankleft:', emoji.get('bank left'));
});

test('emoji - get - astromech', async t => {
	t.is(':astromech:', emoji.get('astromech'));
});

test('emoji - get - bank right', async t => {
	t.is(':bankright:', emoji.get('bank right'));
});

test('emoji - get - barrel roll', async t => {
	t.is(':barrelroll:', emoji.get('barrel roll'));
});

test('emoji - get - boost', async t => {
	t.is(':boost:', emoji.get('boost'));
});

test('emoji - get - bomb', async t => {
	t.is(':xbomb:', emoji.get('bomb'));
});

test('emoji - get - cannon', async t => {
	t.is(':cannon:', emoji.get('cannon'));
});

test('emoji - get - cargo', async t => {
	t.is(':cargo:', emoji.get('cargo'));
});

test('emoji - get - cloak', async t => {
	t.is(':cloak:', emoji.get('cloak'));
});

test('emoji - get - crew', async t => {
	t.is(':crew:', emoji.get('crew'));
});

test('emoji - get - critical hit', async t => {
	t.is(':crit:', emoji.get('critical hit'));
});

test('emoji - get - elite', async t => {
	t.is(':elite:', emoji.get('elite'));
});

test('emoji - get - energy', async t => {
	t.is(':energy:', emoji.get('energy'));
});

test('emoji - get - evade', async t => {
	t.is(':evade:', emoji.get('evade'));
});

test('emoji - get - focus', async t => {
	t.is(':focus:', emoji.get('focus'));
});

test('emoji - get - hit', async t => {
	t.is(':hit:', emoji.get('hit'));
});

test('emoji - get - illicit', async t => {
	t.is(':illicit:', emoji.get('illicit'));
});

test('emoji - get - kturn', async t => {
	t.is(':kturn:', emoji.get('kturn'));
});

test('emoji - get - missile', async t => {
	t.is(':missile:', emoji.get('missile'));
});

test('emoji - get - modification', async t => {
	t.is(':modification:', emoji.get('modification'));
});

test('emoji - get - salvaged astromech', async t => {
	t.is(':salvaged:', emoji.get('salvaged astromech'));
});

test('emoji - get - slam', async t => {
	t.is(':slam:', emoji.get('slam'));
});

test('emoji - get - s loop left', async t => {
	t.is(':sloopleft:', emoji.get('s loop left'));
});

test('emoji - get - s loop right', async t => {
	t.is(':sloopright:', emoji.get('s loop right'));
});

test('emoji - get - stop', async t => {
	t.is(':stop:', emoji.get('stop'));
});

test('emoji - get - straight', async t => {
	t.is(':straight:', emoji.get('straight'));
});

test('emoji - get - system', async t => {
	t.is(':system:', emoji.get('system'));
});

test('emoji - get - target lock', async t => {
	t.is(':targetlock:', emoji.get('target lock'));
});

test('emoji - get - team', async t => {
	t.is(':team:', emoji.get('team'));
});

test('emoji - get - tech', async t => {
	t.is(':tech:', emoji.get('tech'));
});

test('emoji - get - torpedo', async t => {
	t.is(':torpedo:', emoji.get('torpedo'));
});

test('emoji - get - t roll left', async t => {
	t.is(':trollleft:', emoji.get('t roll left'));
});

test('emoji - get - t roll right', async t => {
	t.is(':trollright:', emoji.get('t roll right'));
});

test('emoji - get - turn left', async t => {
	t.is(':turnleft:', emoji.get('turn left'));
});

test('emoji - get - turn right', async t => {
	t.is(':turnright:', emoji.get('turn right'));
});

test('emoji - get - turret', async t => {
	t.is(':turret:', emoji.get('turret'));
});

test('emoji - get - unknown', async t => {
	t.false(emoji.get('cat'));
});
