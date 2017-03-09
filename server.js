'use strict'

const express    = require('express');
const Slapp      = require('slapp');
const ConvoStore = require('slapp-convo-beepboop');
const Context    = require('slapp-context-beepboop');

// Local modules
const firebase    = require('./src/firebase');

// use `PORT` env var on Beep Boop - default to 3000 locally
const port = process.env.PORT || 3000;

let slapp = Slapp({
	// Beep Boop sets the SLACK_VERIFY_TOKEN env var
	verify_token: process.env.SLACK_VERIFY_TOKEN,
	convo_store:  ConvoStore(),
	context:      Context()
});

// Message handlers
require('./responses/help')(slapp);
require('./responses/card')(slapp, firebase);
require('./responses/thanks')(slapp);


// Catch-all for any other responses not handled above
slapp.message(/[.]*/i, ['direct_mention', 'direct_message'], (msg) => {
	msg.say('Sorry i\'ve got no idea what you\'re going on about, try `help`')
});

// attach Slapp to express server
let server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
	if (err) {
		return console.error(err)
	}

	console.log(`Listening on port ${port}`)
})
