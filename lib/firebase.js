const firebase = require('firebase-admin');
const fbmodel  = require('./model');
const fbAuth   = require('../config/serviceAccountKey.json');

const FB_DB_URL = 'https://slack-xwing-card.firebaseio.com';

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

function setupConnection() {
	firebase.initializeApp({
		credential:  firebase.credential.cert(fbAuth),
		databaseURL: FB_DB_URL
	});

	fbDb = firebase.database();
}

function init() {
	setupConnection();
	getRefs();
	setupSlots();
	setupCards();
}

init();

module.exports.slots = () => slots.data;
module.exports.cards = () => cards.data;
module.exports.refs  = refs;
