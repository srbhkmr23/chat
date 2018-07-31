import express from 'express';
import http from 'http';

import socketIO from 'socket.io';
import userRoutes from './user/userRoutes';
import employeeRoutes from './employee/employeeRoutes';

import chatModel from './chat/chatModel'
import userModel from './user/userModel'

const app = express();
const bodyParser = require('body-parser');

var cors = require('cors');
// app.options('*', cors());
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user',userRoutes);
app.use('/employee',employeeRoutes);

app.get('/', (req, res) => {
	// res.send('Hello World!')

  res.writeHead(200, {"Content-Type": "application/json"});
  

  let resultStr = JSON.stringify("Hello World!");
  res.write(resultStr);
  res.end();
})


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// app.listen(7000, () => {
// 	console.log('Example app listening on port 7000!................')
// })

const httpObj = http.Server(app);
const io = socketIO(httpObj);

let users={};

let clients = 0;
io.on('connection', function(socket) {

   clients++;
   console.log('-----------------new connection---------------')
   console.log("socket",socket.id)
   console.log("socket.handshake.query['email']  ",socket.handshake.query['email'])

   users[socket.handshake.query['email']]=socket.id;

   
   // socket.broadcast.emit('newUserConnect',{ description: clients + ' clients connected!','onlineUserList':users})
   socket.broadcast.emit('newconnection',{'onlineUserList':users})
   io.to( users[socket.handshake.query['email']] ).emit('newconnection', {'onlineUserList':users});


   socket.on('sendMessage', function(data){
    console.log("users",users)
     chatModel.addMessageInDb(data);
     let newDataObject = {
      senderId:data.from,
      receiverId:data.to,
      message:data.msg
     }
     io.to(users[data.to]).emit('getMessage', newDataObject);
     io.to(users[data.from]).emit('getMessage', newDataObject);
   });

   socket.on('getAllMessage', function(data){
    console.log(data)
     chatModel.getAllMessage(data,(list)=>{
      io.to(users[data.from]).emit('getAllMessage', list);
     });
   });

   socket.on('getAllUsers', function(data){
     // chatModel.getAllMessage(data,(list)=>{
     //  io.to(users[data.from]).emit('getAllMessage', list);
     // });

     userModel.getAllUsers((list)=>{
      socket.broadcast.emit('getAllUsers',{'usersList':list})
     })

   });

   socket.on('offline',  (userId) =>{
      clients--;
      //users

      console.log("========offline=======")
      delete users[userId];
      socket.broadcast.emit('newconnection',{'onlineUserList':users})
      // socket.broadcast.emit('newUserConnect',{ description: clients + ' clients connected!','onlineUserList':users})
   });



   socket.on('disconnect', function () {
      clients--;
      socket.broadcast.emit('newUserConnect',{ description: clients + ' clients connected!','onlineUserList':users})
   });

});



httpObj.listen(7000, function() {
   console.log('listening on localhost:7000');
});