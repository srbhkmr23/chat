'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _employeeModel = require('./employeeModel');

var _employeeModel2 = _interopRequireDefault(_employeeModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var employeeRoutes = _express2.default.Router();

employeeRoutes.get('/all', function (req, res) {
    _employeeModel2.default.getEmployeeList(req, res);
});
employeeRoutes.put('/add', function (req, res) {
    _employeeModel2.default.addEmployee(req, res);
});

employeeRoutes.post('/update', function (req, res) {
    _employeeModel2.default.updateEmployee(req, res);
});

employeeRoutes.delete('/delete', function (req, res) {
    _employeeModel2.default.deleteEmployee(req, res);
});

exports.default = employeeRoutes;