function FBModel(ref, updateFunction) {
	let data    = [];
	let rawData = {};

	function handleAddedSlot(slotData) {
		rawData[slotData.key] = slotData.val();
		data = updateFunction(rawData);
	}

	function handleRemovedSlot(slotData) {
		delete rawData[slotData.key];
		data = updateFunction(rawData);
	}

	this.data = () => data;
	this.raw  = () => rawData;

	function init() {
		ref.on('child_added', (handleAddedSlot));
		ref.on('child_changed', (handleAddedSlot));
		ref.on('child_removed', handleRemovedSlot);
	}

	init();
}

module.exports = (ref, updateFunction) => new FBModel(ref, updateFunction);
