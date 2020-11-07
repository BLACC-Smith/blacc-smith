// The request is what comes after 'Feature:' in
// someone's message in the blacc-smith channel
//
// For testing, we don't check what channel the 'Feature:'
// format came from but in production, we will.
exports.handleNewRequest = (request) => {
	// Send request to github api
	//const req = await postRequest(request)
	return `New Issue: ${request.charAt(0).toUpperCase()}${request.slice(1)}`;
};

const postRequest = (request) => {
	const url = 'https://api.github.com/repos/BLACC-Smith/blacc-smith/issues'
	$.post(url, request)
};
