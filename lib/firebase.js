const firebase = require('firebase-admin');
const fbmodel  = require('./model');

let fbDb;
let slots;
let cards;
let refs = {};

function updateSlotArray(slots) {
	return Object.getOwnPropertyNames(slots);
}

function setupSlots() {
	slots = fbmodel(refs.slots, updateSlotArray);
}

function updateCardArray(cards) {
	return Object.keys(cards).map(key => cards[key]);
}

function setupCards() {
	cards = fbmodel(refs.cards, updateCardArray);
}

function getRefs() {
	refs.cards = fbDb.ref('cards');
	refs.slots = fbDb.ref('slots');
}

function getCredentials() {
	// Required names for firebase
	/*eslint-disable camelcase */
	return {
		type:                        'service_account',
		project_id:                  process.env.PROJECT_ID,
		private_key_id:              process.env.KEY_ID,
		private_key:                 process.env.PRIVATE_KEY,
		client_email:                process.env.CLIENT_EMAIL,
		client_id:                   process.env.CLIENT_ID,
		auth_uri:                    'https://accounts.google.com/o/oauth2/auth',
		token_uri:                   'https://accounts.google.com/o/oauth2/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url:        'https://www.googleapis.com/robot/v1/metadata/x509/' + process.env.CLIENT_EMAIL.replace('@', '%40')
	};
	/*eslint-enable camelcase */
}

function setupConnection() {
	let app = firebase.initializeApp({
		credential:  firebase.credential.cert(getCredentials()),
		databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`
	});

	fbDb = app.database();
}

function init() {
	setupConnection();
	getRefs();
	setupSlots();
	setupCards();
}

init();

module.exports.slots = () => slots.data();
module.exports.cards = () => cards.data();
module.exports.refs  = refs;
