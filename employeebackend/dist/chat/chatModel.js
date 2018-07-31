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

var chatModel = {};

chatModel.addMessageInDb = function (data) {
	_connection2.default.getConnection().then(function (connection) {

		var newMessageData = {
			senderId: data.from,
			receiverId: data.to,
			updatedAt: '',
			message: data.msg,
			read: ''
		};

		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('chat');
		collection.insert(newMessageData, function (error, response) {
			connection.close();
			if (error) {
				console.log(error);
			}

			if (!error) {
				console.log("message added successfully");
			}
		});
	});
};

chatModel.getAllMessage = function (data, cb) {
	_connection2.default.getConnection().then(function (connection) {

		var messageData = { $or: [{
				senderId: data.from,
				receiverId: data.to
			}, {
				senderId: data.to,
				receiverId: data.from
			}]

		};

		var employeedb = connection.db(_config2.default.db);
		var collection = employeedb.collection('chat');
		collection.find(messageData).toArray(function (err, list) {
			connection.close();

			cb(list);
		});
	});
};

exports.default = chatModel;