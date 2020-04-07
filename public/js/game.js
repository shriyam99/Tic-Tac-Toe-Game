var roomId;
var sampleFunc = ()=>{

}
var leaveRoom = ()=>{
  if(confirm('Are u sure?'))
    window.location.href = '/';
}
const socket = io();
socket.on('connect', ()=>{
  $('.mainGame').hide();
  console.log('User connected');
  var params = searchToObject();
  socket.emit('join', params, (err, res)=>{
    if(err){
      alert(err);
      window.location.href = '/';
    }
    console.log(res);
    roomId = res;
    $('.roomId').text(`Room ID: ${roomId}`);
  });
});

socket.on('startGame', (res)=>{
  console.log('Game has started');
  $('.loadingScreen').hide();
  $('.mainGame').show();
  if(res){

  }
});
socket.on('playerNames', (data)=>{

})
socket.on('yourTurn', ()=>{

});
socket.on('opponentTurn', ()=>{

});
socket.on('disconnect', ()=>{
  console.log('User disconnected');
});
