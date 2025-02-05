var roomId;
var hasGameBegun = false;
var sampleFunc = ()=>{
  document.getElementsByClassName('mainGame')[0].style.display = 'none';
}
const socket = io();
function searchToObject() {
  var searchString = window.location.search;
  searchString = searchString.replace(/[+]/g, ' ');
  var pairs = searchString.substring(1).split("&"),
    obj = {},
    pair,
    i;
  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;
    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }
  return obj;
}

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
        matchTied: isMatchTied(),
        opponentHasLeft: false
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
    restartGame();
    socket.emit('restartGame');
  }
  else if(!data.isWinner && !data.tie){
    alert(`You've lost the match!`);
    restartGame();
    socket.emit('restartGame');
  }
  else {
    alert(`Match TIE!!`);
    restartGame();
    socket.emit('restartGame');
  }
});

socket.on('playerNames', (data)=>{
  $('#players').text(`${data[0].toLowerCase()} v/s ${data[1].toLowerCase()}`);
});

socket.on('disconnect', ()=>{
  console.log('User disconnected');
});
