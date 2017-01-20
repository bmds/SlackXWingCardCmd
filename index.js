const express    = require('express');
const bodyParser = require('body-parser');

const firebase   = require('./lib/firebase');
const search     = require('./lib/search');
const dataImport = require('./lib/import');

const port   = process.env.PORT || 3000;
const app    = express();
const router = express.Router();

// Setup dependencies
search.setDb(firebase);
dataImport.setDb(firebase);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTES FOR OUR API
router.route('/slash')
	.post((req, res) => {
		if(req.body.import && req.body.import === 'yoda') {
			dataImport.run()
				.then((response) => res.json(response));
		} else if(req.body.text) {
			search.run(req.body)
				.then((response) => res.json(response));
		} else {
			res.send('There was an error with the request');
		}
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
