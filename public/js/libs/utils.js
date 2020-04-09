var leaveRoom = ()=>{
  if(confirm('Are u sure?')){
    socket.emit('changeTurn', {
      opponentHasLeft: true
    });
    window.location.href = '/';
  }
}


function turnGreen(){
  var turn = $('#turn');
  var style = {
    padding: '2px 5px 2px 5px',
    background: 'green',
    borderRadius: '5px',
    boxShadow: '4px 4px 8px rgba(50, 50, 50, 0.6)'
  }
  $('.game.card').css('opacity', 1);
  turn.css(style);
  turn.text(`It's your turn`);
}

function turnRed(){
  var turn = $('#turn');
  var style = {
    padding: '2px 5px 2px 5px',
    background: 'maroon',
    borderRadius: '5px',
    boxShadow: '4px 4px 8px rgba(50, 50, 50, 0.6)'
  }
  $('.game.card').css('opacity', 0.5);
  turn.css(style);
  turn.text(`Opponent's turn`);
  $('.gameCol').off();
}

function giveDataSet(letter){
  var table = $('.gameCol');
  var dataset = [];
  for(var i=0; i<table.length; i++){
    if(table[i].innerText===letter)
      dataset.push(true);
    else {
      dataset.push(false);
    }
  }
  return dataset;
}

function updateDataSet(data, letter){
  var table = $('.gameCol');
  for(var i=0; i<table.length; i++){
    if(data[i]===true){
      table[i].innerHTML = `<div class="gameColText">${letter}</div>`;
    }
  }
}

function disableAllClicked(){
  var table = $('.gameCol');
  for(var i=0; i<table.length; i++){
    if(table[i].innerText!=='')
      $(table[i]).off();
  }
}

function isMatchTied(){
  var res = true;
  var table = $('.gameCol');
  for(var i=0; i<table.length; i++){
    if(table[i].innerText==='')
      res = false;
  }
  return res;
}

function restartGame(){
  var table = $('.gameCol');
  for(var i=0; i<table.length; i++){
    table[i].innerHTML = `<div class="gameColText"></div>`;
  }
  turnRed();
}
