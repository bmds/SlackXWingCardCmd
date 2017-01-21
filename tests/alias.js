import test from 'ava';
import alias from '../lib/alias';

// test('testname', async t => {
// 	t.is('bb8', alias._astromech('bb-8'));
// });

test('astromech', async t => {
	t.deepEqual(['bb8'], alias._astromech('bb-8'));
});

test('astromech - no hyphen', async t => {
	t.false(alias._astromech('r2 astromech'));
});

// test('system - no hyphen', async t => {
// 	t.false(alias._astromech('r2 astromech'));
// });
