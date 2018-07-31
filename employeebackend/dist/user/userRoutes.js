'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _userModel = require('./userModel');

var _userModel2 = _interopRequireDefault(_userModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRoutes = _express2.default.Router();

userRoutes.post('/login', function (req, res) {
    _userModel2.default.login(req, res);
});

userRoutes.put('/signup', function (req, res) {
    _userModel2.default.signUp(req, res);
});

userRoutes.get('/all', function (req, res) {
    _userModel2.default.getUserList(req, res);
});

exports.default = userRoutes;