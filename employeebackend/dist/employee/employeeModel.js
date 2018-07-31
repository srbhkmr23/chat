'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _connection = require('../core/connection');

var _connection2 = _interopRequireDefault(_connection);

var _response = require('../core/response');

var _response2 = _interopRequireDefault(_response);

var _config = require('../core/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectID = _mongodb2.default.ObjectID;
var employeeModel = {};

employeeModel.getEmployeeList = function (req, res) {
	var result = {};
	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('employees');
		collection.find({}).toArray(function (err, list) {
			result.status = 200;
			result.employeeList = list || [];
			_response2.default.sendResponseToClient(req, res, result, connection);
		});
	});
};

employeeModel.addEmployee = function (req, res) {
	var result = {};
	var requestData = req.body || {};
	var newEmployeeData = {
		name: requestData.name,
		gender: requestData.gender,
		contact: requestData.contact,
		address: requestData.address,
		email: requestData.email
	};

	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('employees');

		collection.insert(newEmployeeData, function (error, response) {
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

employeeModel.updateEmployee = function (req, res) {
	var result = {};
	var requestData = req.body || {};
	var updateEmployeeData = {
		name: requestData.name,
		gender: requestData.gender,
		contact: requestData.contact,
		address: requestData.address,
		email: requestData.email
	};

	var id = ObjectID(requestData.id);

	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('employees');
		collection.replaceOne({ _id: id }, updateEmployeeData, function (error, response) {
			if (error) {
				console.log(error);
				result.message = "Somting went wrong";
				result.error = error;
			}

			if (!error) {
				result.status = 200;
				result.userData = response.ops || {};
				console.log("response : ", response);
			}
			_response2.default.sendResponseToClient(req, res, result, connection);
		});
	});
};

employeeModel.deleteEmployee = function (req, res) {
	var result = {};
	var requestData = req.body || {};
	var id = ObjectID(requestData.id);

	_connection2.default.getConnection().then(function (connection) {
		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('employees');
		collection.deleteOne({ _id: id }, function (error, response) {
			if (error) {
				console.log(error);
				result.message = "Somting went wrong";
				result.error = error;
			}

			if (!error) {
				result.status = 200;
				console.log("response : ", response);
			}
			_response2.default.sendResponseToClient(req, res, result, connection);
		});
	});
};

exports.default = employeeModel;