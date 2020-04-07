const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const shortid = require('shortid');

var {isValidString} = require('./utils/validation');
var {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log('User connected');
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
  var id = shortid.generate();

  socket.on('join', (params, callback)=>{
    if(isValidString(params.displayName) && isValidString(params.roomType)){
      var roomType = params.roomType;
      if(roomType=='joinRoom'){
        users.addUser(socket.id, params.displayName, id);
        socket.join(id);
        console.log(users.getUser(socket.id));
        callback(null, id);
      }
      else if(roomType=='joinById' && isValidString(params.roomId) && shortid.isValid(params.roomId) && params.roomId.length<10){
        users.addUser(socket.id, params.displayName, params.roomId);
        socket.join(params.roomId);
        if(users.getNumberOfUsers(params.roomId)>2)
          return callback('Something went wrong');
        console.log(users.getUser(socket.id));
        callback(null, params.roomId);
      }
      else{
        callback('Invalid ID provided');
      }
    }
    else{
      callback('Something went wrong');
    }
  });

  socket.on('disconnect', ()=>{
    console.log('User disconnected');
    socket.leave(users.getUser(socket.id).room);
    users.removeUser(socket.id);
  })
});

server.listen(PORT, ()=>{
  console.log(`Server has started on PORT: ${PORT}`);
});
