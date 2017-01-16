const { send } = require('micro');
const qs       = require('querystring');
const url      = require('url');
const search   = require('./lib/search');

function handleBadRequest() {
	return 'There was an error with the request';
}

module.exports = async function BaseHandler(req, res) {
	const query = qs.parse(url.parse(req.url).query);

	if(!query.text) {
		send(res, 200, handleBadRequest(query));
	} else {
		send(res, 200, search(query));
	}
}
