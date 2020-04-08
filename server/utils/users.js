class Users {
  constructor() {
    this.users= [];
  }
  addUser(id, name, room, letter){
    var user= { id, name, room, letter };
    this.users.push(user);
    return user;
  }

  removeUser(id){
    var user;
    for(var i=this.users.length-1; i>=0; i--){
      if(this.users[i].id===id){
        user = this.users[i];
        this.users.splice(i, 1);
      }
    }
    return user;
  }

  getUser(id){
    return this.users.filter(user => user.id===id)[0];
  }

  getOpponent(id){
    try {
      var room = this.getUser(id).room;
    } catch (e) {
      return false;
    }
    var opponent;
    this.users.forEach((user)=>{
      if(user.room===room && user.id!=id)
        opponent = user;
    });
    return opponent;
  }

  getNumberOfUsers(room){
    return this.users.length;
  }
  getUserList(room){
    var userlist = this.users.filter(user => user.room===room);
    return userlist.map(user=> user.name);
  }

}

module.exports = {Users};
