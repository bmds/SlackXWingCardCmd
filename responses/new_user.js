const HELP_TEXT = `I will respond to the following messages:
\`help\` - to see this message.
\`card\` $ - to perform a search for a card
`;

module.exports = function(slapp) {
	slapp.on('team_join', (bot, message) => {
		bot.api.im.open({user: message.user.id}, (err, response) => {
			if(response.channel.id) {
				bot.say({channel: response.channel.id, text: 'Welcome to xwingtmg.slack.com!'})
				bot.say({channel: response.channel.id, text: HELP_TEXT})
			}
		});
	});

	// Can use a regex as well
	slapp.message(/^(thanks|thank you)/i, ['mention', 'direct_message'], (msg) => {
		// You can provide a list of responses, and a random one will be chosen
		// You can also include slack emoji in your responses
		msg.say([
			'You\'re welcome :smile:',
			':thumbsup:',
			':+1: Of course',
			'No worries'
		]);
	});
};
