import test from 'ava';
import slackMessage from '../lib/slackMessage';

const RESPONSE_PUBLIC  = 'in_channel';
const RESPONSE_PRIVATE = 'ephemeral';
const TEST_TEXT        = 'hello dave';

test('basic card', async t => {
	let cardConfig = {
		text:      TEST_TEXT,
		isPrivate: false
	};

	// Required names for slack
	/*eslint-disable camelcase */
	t.deepEqual(slackMessage(cardConfig), {
		parse:         'full',
		text:          TEST_TEXT,
		unfurl_media:  true,
		response_type: RESPONSE_PUBLIC
	});
	/*eslint-enable camelcase */
});

test('private basic card', async t => {
	let cardConfig = {
		text:      TEST_TEXT,
		isPrivate: true
	};

	// Required names for slack
	/*eslint-disable camelcase */
	t.deepEqual(slackMessage(cardConfig), {
		parse:         'full',
		text:          TEST_TEXT,
		unfurl_media:  true,
		response_type: RESPONSE_PRIVATE
	});
	/*eslint-enable camelcase */
});

test('card with image', async t => {
	let cardConfig = {
		text:      'hello dave',
		isPrivate: true,
		image:     'path/to the/image.png'
	};

	// Required names for slack
	/*eslint-disable camelcase */
	t.deepEqual(slackMessage(cardConfig), {
		parse:         'full',
		text:          'hello dave',
		unfurl_media:  true,
		response_type: 'ephemeral',
		attachments: [{
			fallback:  'Image failed to load',
			image_url: 'path/to%20the/image.png'
		}]
	});
	/*eslint-enable camelcase */
});
