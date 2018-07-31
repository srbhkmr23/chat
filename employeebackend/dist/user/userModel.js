'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _connection = require('../core/connection');

var _connection2 = _interopRequireDefault(_connection);

var _response = require('../core/response');

var _response2 = _interopRequireDefault(_response);

var _config = require('../core/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userModel = {};

userModel.login = function (req, res) {
	var userEmailId = req.body.email || '';
	var userPassword = req.body.password || '';

	console.log("req.body", req.body);
	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('user');
		collection.find({
			email: userEmailId,
			password: userPassword
		}).toArray(function (err, list) {
			var result = {};
			if (list.length == 0) {
				result.message = "Id or password is wrong! please try again.";
			} else if (list.length == 1) {
				result.status = 200;
				result.message = "Login success.";
				result.userDetails = list[0];
			} else {
				result.message = "Somting went wrong";
			}
			_response2.default.sendResponseToClient(req, res, result, connection);
		});
	});
};

userModel.signUp = function (req, res) {
	var requestData = req.body || {};
	var newUserData = {
		name: requestData.name,
		gender: requestData.gender,
		contact: requestData.contact,
		address: requestData.address,
		email: requestData.email,
		password: requestData.password
	};

	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('user');
		collection.insert(newUserData, function (error, response) {
			var result = {};
			if (error) {
				console.log(error);
				result.message = "Somting went wrong";
				result.error = error;
			}

			if (!error) {
				result.status = 200;
				result.userData = response.ops || {};
			}
			_response2.default.sendResponseToClient(req, res, result, connection);
		});
	});
};

userModel.getUserList = function (req, res) {
	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('user');
		collection.find({}).toArray(function (err, list) {
			var result = {};
			result.status = 200;
			result.userList = list || [];
			_response2.default.sendResponseToClient(req, res, result, connection);
		});
	});
};

userModel.getAllUsers = function (cb) {
	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('user');
		collection.find({}).toArray(function (err, list) {
			cb(list);
		});
	});
};

exports.default = userModel;