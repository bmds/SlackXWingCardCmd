import test from 'ava';
import mockery from 'mockery';
import mockFirebase from './mocks/firebase';

let search;

test.before(() => {
	mockery.enable();
	mockery.registerMock('../src/firebase', mockFirebase);
	search = require('../app/search');
});

test.after(() => {
	mockery.disable();
});

test('search - basic text', async t => {
	t.plan(1);

	return search.byText({term: 'autothrusters'})
		.then(r => {
			t.deepEqual(
				[mockFirebase.testData.validCardData],
				r
			);
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

	return search.byId('4u')
		.then(r => {
			t.deepEqual(
				[mockFirebase.testData.validIdData],
				r
			);
		});
});
//
// test('search - id - quiet', async t => {
// 	t.plan(1);
//
// 	return search.byId({
// 		term:      '4u',
// 		isPrivate: true
// 	})
// 		.then(r => {
// 			t.deepEqual(
// 				getResponseObj(
// 					'R2-F2 (:astromech: | unique): 3pts\nshorter',
// 					'https://r2-f2.png',
// 					true
// 				),
// 				r
// 			);
// 		});
// });

test.todo('search - id (invalid)');

test.todo('search - unknown flag');

test.todo('search - multiple');
