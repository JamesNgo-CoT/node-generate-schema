const nodeHtmlRequest = require('node-https-request');

const nodeGenerateSchema = require('./index');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

nodeHtmlRequest({
	// REMOVE
	headers: { 'Accept': 'application/json' }
}).then(({ data: metadata }) => {
	console.log(nodeGenerateSchema(metadata, 'Submissions'));
});
