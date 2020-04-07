var roomId;
var sampleFunc = ()=>{
  $('.mainGame').hide();
}
const socket = io();
socket.on('connect', ()=>{
  console.log('User connected');
  var params = searchToObject();
  socket.emit('join', params, (err, res)=>{
    if(err){
      alert(err);
      window.location.href = '/';
    }
    console.log(res);
    roomId = res;
    $('#roomId').text(`Room ID: ${roomId}`);
  });
});

socket.on('disconnect', ()=>{
  console.log('User disconnected');
});
