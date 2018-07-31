'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _userRoutes = require('./user/userRoutes');

var _userRoutes2 = _interopRequireDefault(_userRoutes);

var _employeeRoutes = require('./employee/employeeRoutes');

var _employeeRoutes2 = _interopRequireDefault(_employeeRoutes);

var _chatModel = require('./chat/chatModel');

var _chatModel2 = _interopRequireDefault(_chatModel);

var _userModel = require('./user/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var bodyParser = require('body-parser');

var cors = require('cors');
// app.options('*', cors());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', _userRoutes2.default);
app.use('/employee', _employeeRoutes2.default);

app.get('/', function (req, res) {
  // res.send('Hello World!')

  res.writeHead(200, { "Content-Type": "application/json" });

  var resultStr = JSON.stringify("Hello World!");
  res.write(resultStr);
  res.end();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// app.listen(7000, () => {
// 	console.log('Example app listening on port 7000!................')
// })

var httpObj = _http2.default.Server(app);
var io = (0, _socket2.default)(httpObj);

var users = {};

var clients = 0;
io.on('connection', function (socket) {

  clients++;
  console.log('-----------------new connection---------------');
  console.log("socket", socket.id);
  console.log("socket.handshake.query['email']  ", socket.handshake.query['email']);

  users[socket.handshake.query['email']] = socket.id;

  // socket.broadcast.emit('newUserConnect',{ description: clients + ' clients connected!','onlineUserList':users})
  socket.broadcast.emit('newconnection', { 'onlineUserList': users });
  io.to(users[socket.handshake.query['email']]).emit('newconnection', { 'onlineUserList': users });

  socket.on('sendMessage', function (data) {
    console.log("users", users);
    _chatModel2.default.addMessageInDb(data);
    var newDataObject = {
      senderId: data.from,
      receiverId: data.to,
      message: data.msg
    };
    io.to(users[data.to]).emit('getMessage', newDataObject);
    io.to(users[data.from]).emit('getMessage', newDataObject);
  });

  socket.on('getAllMessage', function (data) {
    console.log(data);
    _chatModel2.default.getAllMessage(data, function (list) {
      io.to(users[data.from]).emit('getAllMessage', list);
    });
  });

  socket.on('getAllUsers', function (data) {
    // chatModel.getAllMessage(data,(list)=>{
    //  io.to(users[data.from]).emit('getAllMessage', list);
    // });

    _userModel2.default.getAllUsers(function (list) {
      socket.broadcast.emit('getAllUsers', { 'usersList': list });
    });
  });

  socket.on('offline', function (userId) {
    clients--;
    //users

    console.log("========offline=======");
    delete users[userId];
    socket.broadcast.emit('newconnection', { 'onlineUserList': users });
    // socket.broadcast.emit('newUserConnect',{ description: clients + ' clients connected!','onlineUserList':users})
  });

  socket.on('disconnect', function () {
    clients--;
    socket.broadcast.emit('newUserConnect', { description: clients + ' clients connected!', 'onlineUserList': users });
  });
});

httpObj.listen(7000, function () {
  console.log('listening on localhost:7000');
});