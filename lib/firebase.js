const firebase = require('firebase-admin');
const fbAuth   = require('../config/serviceAccountKey.json');

const FB_DB_URL = 'https://slack-xwing-card.firebaseio.com';

let fbDb;
let refs    = {};
let slots   = {};
let slotArr = [];

function updateSlotArray() {
	slotArr = Object.getOwnPropertyNames(slots);
}

function handleSlotData(dataSnapshot) {
	slots = dataSnapshot.val();
	updateSlotArray();
}

function handleAddedSlot(slotData) {
	slots[slotData.key] = slotData.val();
	updateSlotArray();
}

function handleRemovedSlot(slotData) {
	delete slots[slotData.key];
	updateSlotArray();
}

function setupSlots() {
	refs.slots.on('child_added', handleAddedSlot);
	refs.slots.on('child_removed', handleRemovedSlot);
	refs.slots.once('value', handleSlotData);
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
}

init();

module.exports.slots = slotArr;
module.exports.refs  = refs;
