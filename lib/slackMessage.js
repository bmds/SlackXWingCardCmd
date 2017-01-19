const RESPONSE_PUBLIC  = 'in_channel';
const RESPONSE_PRIVATE = 'ephemeral';

const baseResponse = {
	// Required names for slack
	/*eslint-disable camelcase */
	parse:         'full',
	text:          '',
	unfurl_media:  true
	/*eslint-enable camelcase */
};

function getImageAttachment(image) {
	// Required names for slack
	/*eslint-disable camelcase */
	return [{
		fallback: 'Image failed to load',
		image_url: encodeURI(image)
	}];
	/*eslint-enable camelcase */
}

module.exports = function create(data) {
	let responseObject = Object.assign({}, baseResponse);

	responseObject.text = data.text;

	if(data.image) {
		responseObject.attachments = getImageAttachment(data.image);
	}

	// Required names for slack
	/*eslint-disable camelcase */
	responseObject.response_type = (!data.isPrivate ? RESPONSE_PUBLIC : RESPONSE_PRIVATE);
	/*eslint-enable camelcase */

	return responseObject;
};
