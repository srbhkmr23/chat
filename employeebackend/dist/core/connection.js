'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectionModel = {};
connectionModel.getConnection = function () {
	var connectionString = '';
	var host = process.env.HOST || _config2.default.host;
	var mongoport = process.env.MONGO_PORT || _config2.default.mongoport;
	var db = process.env.MONGO_DB || _config2.default.db;
	connectionString = 'mongodb://' + host + ':' + mongoport;
	console.log('connectionString', connectionString);
	var MongoClient = _mongodb2.default.MongoClient;

	return new Promise(function (resolve, reject) {
		MongoClient.connect(connectionString, function (err, connection) {
			if (err) {
				console.dir("ERROR:----", err);
				reject(err);
			}

			if (!err) {
				resolve(connection);
			}
		});
	});
};

connectionModel.closeConnection = function (connection) {
	connection.close();
	console.log('connection closed.');
};

exports.default = connectionModel;