import test from 'ava';
import emoji from '../lib/emoji';

// test('testname', async t => {
// 	t.is('bb8', emoji.replace('bb-8'));
// });

test('emoji - nothing to replace', async t => {
	t.is('hey some string', emoji.replace('hey some string'));
});

test('emoji - barrel roll', async t => {
	t.is('Perform a free barrel roll action. If you do not have the :barrelroll: action icon', emoji.replace('Perform a free barrel roll action. If you do not have the [Barrel Roll] action icon'));
});

test('emoji - boost', async t => {
	t.is('Then, if you do not have the :boost: action icon, roll 2 attack dice.', emoji.replace('Then, if you do not have the [Boost] action icon, roll 2 attack dice.'));
});

test('emoji - bomb', async t => {
	t.is('Your upgrade bar gains two additional :xbomb: upgrade icons.', emoji.replace('Your upgrade bar gains two additional [Bomb] upgrade icons.'));
});

test('emoji - crew', async t => {
	t.is('Your upgrade bar gains the :crew: upgrade icon.', emoji.replace('Your upgrade bar gains the [Crew] upgrade icon.'));
});

test('emoji - crit', async t => {
	t.is('Immediately after rolling your attack dice, you must change all of your :crit: results to', emoji.replace('Immediately after rolling your attack dice, you must change all of your [Critical Hit] results to'));
});

test('emoji - elite', async t => {
	t.is('Your upgrade bar gains the :elite: upgrade icon.<br />', emoji.replace('Your upgrade bar gains the [Elite] upgrade icon.<br />'));
});

test('emoji - evade', async t => {
	t.is('assign 1 focus token to your ship. For each :evade: result', emoji.replace('assign 1 focus token to your ship. For each [Evade] result'));
});

test('emoji - focus', async t => {
	t.is('you may change 1 of your :focus: results to a', emoji.replace('you may change 1 of your [Focus] results to a'));
});

test('emoji - hit', async t => {
	t.is('When attacking, during the “Modify Attack Dice” step, you may cancel all of your dice results. Then, you may add 2 :hit: results to your roll', emoji.replace('When attacking, during the “Modify Attack Dice” step, you may cancel all of your dice results. Then, you may add 2 [Hit] results to your roll'));
});

test('emoji - missile', async t => {
	t.is('or :missile: secondary weapon, you may change 1 die result to a', emoji.replace('or [Missile] secondary weapon, you may change 1 die result to a'));
});

test('emoji - system', async t => {
	t.is('Your upgrade bar gains the :system: upgrade icon.', emoji.replace('Your upgrade bar gains the [System] upgrade icon.'));
});

test('emoji - Target Lock', async t => {
	t.is('Your action bar gains the :targetlock: action icon.', emoji.replace('Your action bar gains the [Target Lock] action icon.'));
});

test('emoji - Torpedo', async t => {
	t.is('Your upgrade bar gains the :torpedo: upgrade icon.', emoji.replace('Your upgrade bar gains the [Torpedo] upgrade icon.'));
});

test('emoji - unknown string', async t => {
	t.is('you may change 1 of your [Potato] results to a', emoji.replace('you may change 1 of your [Potato] results to a'));
});
