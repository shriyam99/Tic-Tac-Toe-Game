function isWinner(data){
  if(data[0] && data[1] && data[2])
    return true;
  else if(data[3] && data[4] && data[5])
    return true;
  else if(data[6] && data[7] && data[8])
    return true;
  else if(data[0] && data[4] && data[8])
    return true;
  else if(data[2] && data[4] && data[6])
    return true;
  else {
    return false;
  }
}

module.exports = {isWinner};
