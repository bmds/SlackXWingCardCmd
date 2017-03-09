const HELP_TEXT = `I will respond to the following messages:
\`help\` - to see this message.
\`card\` $ - to perform a search for a card
`;

module.exports = function main(slapp) {
	// response to the user typing "help"
	slapp.message('help', ['mention', 'direct_message'], (msg) => msg.say(HELP_TEXT));

	slapp.on('team_join', (bot, message) => {
		return bot.api.im.open(
			{user: message.user.id},
			(err, response) => {
				if (response.channel.id) {
					const channel = response.channel.id;

					bot.say({
						channel,
						text: `Hi I'm Gonk!`
					});

					return bot.say({
						channel,
						text: HELP_TEXT
					});
				}
			}
		);
	});
};
