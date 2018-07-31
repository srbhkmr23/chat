"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var responseModel = {};

responseModel.sendResponseToClient = function (req, res, result, connection) {
	connection.close();
	console.log('connection closed.');
	// res.setHeader('Content-Type', 'application/json');

	if (result.status == 200) {
		res.writeHead(200, { "Content-Type": "application/json" });
	} else {
		res.writeHead(800, { "Content-Type": "application/json" });
	}

	var resultStr = JSON.stringify(result);
	res.write(resultStr);
	res.end();
};

exports.default = responseModel;