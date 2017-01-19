const { send }   = require('micro');
const qs         = require('querystring');
const url        = require('url');
const firebase   = require('./lib/firebase');
const search     = require('./lib/search');
const dataImport = require('./lib/import');

search.setDb(firebase);
dataImport.setDb(firebase);

module.exports = async function BaseHandler(req, res) {
	const query = qs.parse(url.parse(req.url).query);

	if(query.import && query.import === 'yoda') {
		dataImport.run()
			.then((response) => send(res, 200, response));
	} else if(query.text) {
		search.run(query)
			.then((response) => send(res, 200, response));
	} else {
		send(res, 501, 'There was an error with the request');
	}
}
