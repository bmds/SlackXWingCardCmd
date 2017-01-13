# X-wing slack card command

This repo provides a very simple implementation of a slack command that returns details of upgrade cards for the Fantasy Flight X-Wing game within Slack.

## Usage
The script hosts a single endpoint for Slack to access. It returns JSON with the result of the card search.

## Commands
A basic search is performed with `/card $` which will search using the term contained within $.
A filtered search can be performed with `/card $1 ($2)` where $1 will be the search term and $2 will be the card type to use.

## Dependencies
All of the data for the cards is imported from: [X-Wing Data](https://github.com/guidokessels/xwing-data)
The service uses : [X-Wing Data](https://github.com/guidokessels/xwing-data)
