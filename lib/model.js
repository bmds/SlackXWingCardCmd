class Model {
	constructor(ref, updateFunction) {
		this.data    = [];
		this.rawData = {};
		this.update  = updateFunction;

		ref.on('child_added', (this.handleAddedSlot));
		ref.on('child_removed', this.handleRemovedSlot);
		ref.once('value', this.handleSlotData);
	}

	handleSlotData(dataSnapshot) {
		this.rawData = dataSnapshot.val();
		this.data    = this.update(this.rawData);
	}

	handleAddedSlot(slotData) {
		this.rawData[slotData.key] = slotData.val();
		this.data = this.update(this.rawData);
	}

	handleRemovedSlot(slotData) {
		delete this.rawData[slotData.key];
		this.data = this.update(this.rawData);
	}
}

module.exports = (ref, updateFunction) => new Model(ref, updateFunction);
