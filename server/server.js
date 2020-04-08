const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const shortid = require('shortid');

var {isValidString} = require('./utils/validation');
var {Users} = require('./utils/users');
var {isWinner} = require('./utils/winner');
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

  socket.on('join', (params, callback)=>{
    users.removeUser(socket.id);
    if(isValidString(params.displayName) && isValidString(params.roomType)){
      var roomType = params.roomType;
      if(roomType=='joinRoom'){
        var roomId = shortid.generate();
        users.addUser(socket.id, params.displayName, roomId, 'O');
        socket.join(roomId);
        console.log(users.getUser(socket.id));
        callback(null, roomId);
      }
      else if(roomType=='joinById' && isValidString(params.roomId) && shortid.isValid(params.roomId) && params.roomId.length<10){
        users.addUser(socket.id, params.displayName, params.roomId, 'X');
        socket.join(params.roomId);
        if(users.getNumberOfUsers(params.roomId)>2)
          return callback('Room is already full!');
        console.log(users.getUser(socket.id));
        callback(null, params.roomId);
        socket.emit('startGame', {
          turn: true,
          letter: 'X'
        });
        socket.broadcast.to(params.roomId).emit('startGame', {
          turn: false,
          letter: 'O'
        });
        var players = users.getUserList(params.roomId);
        io.to(params.roomId).emit('playerNames', players);
      }
      else{
        callback('Invalid ID provided');
      }
    }
    else{
      callback('Something went wrong');
    }
  });

  socket.on('changeTurn', (res)=>{
    var user = users.getUser(socket.id);
    socket.broadcast.to(user.room).emit('updateDataSet', res);
    if(res.matchTied){
      io.to(user.room).emit('endGame', {
        isWinner: false,
        tie: true,
        opponentHasLeft: false
      });
    }
    else if(!isWinner(res.dataset)){
      socket.emit('startGame', {
        turn: false,
        letter: user.letter
      });
      socket.broadcast.to(user.room).emit('startGame', {
        turn: true,
        letter: user.letter==='X'? 'O': 'X'
      });
    }
    else{
      socket.emit('endGame', {
        isWinner: true,
        tie: false,
        opponentHasLeft: false
      });
      socket.broadcast.to(user.room).emit('endGame', {
        isWinner: false,
        tie: false,
        opponentHasLeft: false
      });
    }
  });

  socket.on('restartGame', ()=>{
    var user = users.getUser(socket.id);
    socket.emit('startGame', {
      turn: false,
      letter: user.letter
    });
    socket.broadcast.to(user.room).emit('startGame', {
      turn: true,
      letter: user.letter==='X'? 'O': 'X'
    });
  })

  socket.on('disconnect', ()=>{
    console.log('User disconnected');
    // io.to(users.getUser(socket.id).room).emit('endGame', {
    //   isWinner: false,
    //   tie: false,
    //   opponentHasLeft: true
    // });
    // socket.leave(users.getUser(socket.id).room);
    users.removeUser(socket.id);
  })
});

server.listen(PORT, ()=>{
  console.log(`Server has started on PORT: ${PORT}`);
});
