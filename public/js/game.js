var roomId;
var hasGameBegun = false;
var sampleFunc = ()=>{
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
    $('.roomId').text(`Room ID: ${res}`);
  });
});

socket.on('startGame', (res)=>{
  if(!hasGameBegun){
    console.log('Game has started');
    $('.loadingScreen').hide();
    $('.mainGame').show();
    hasGameBegun = true;
  }
  if(res.turn){
    turnGreen();
    $('.gameCol').click(function (){
      $(this).html(`<div class="gameColText">${res.letter}</div>`);
      turnRed();
      var dataset = giveDataSet(res.letter);
      socket.emit('changeTurn', {
        dataset,
        letter: res.letter,
        matchTied: isMatchTied()
      });
    });
    disableAllClicked();
  }
  else{
    turnRed();
  }
});

socket.on('updateDataSet', (res)=>{
  updateDataSet(res.dataset, res.letter);
  disableAllClicked();
})

socket.on('endGame', (data)=>{
  if(data.opponentHasLeft){
    alert('Oponent has left the game!');
    window.location.href='/';
  }
  else if(data.isWinner){
    alert(`You've won the match!`);
    window.location.href='/';
  }
  else if(!data.isWinner && !data.tie){
    alert(`You've lost the match!`);
    window.location.href= '/';
  }
  else {
    alert(`TIE!!`);
    window.location.href= '/';
  }
});

socket.on('playerNames', (data)=>{
  $('#players').text(`${data[0].toLowerCase()} v/s ${data[1].toLowerCase()}`);
});

socket.on('disconnect', ()=>{
  console.log('User disconnected');
});
