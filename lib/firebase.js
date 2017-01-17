const firebase = require('firebase-admin');
const fbAuth   = require('../config/serviceAccountKey.json');

const FB_DB_URL = 'https://slack-xwing-card.firebaseio.com';

firebase.initializeApp({
	credential:  firebase.credential.cert(fbAuth),
	databaseURL: FB_DB_URL
});

const fbDb = firebase.database();

module.exports =  {
	cards: fbDb.ref('cards'),
	slots: fbDb.ref('slots')
};
