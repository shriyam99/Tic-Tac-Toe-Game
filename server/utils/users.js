class Users {
  constructor() {
    this.users= [];
  }
  addUser(id, name, room){
    var user= { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id){
    var user;
    this.users.forEach((data, i) => {
      if(data.id===id){
        user = data;
        this.users.splice(i, 1);
      }
    });
    return user;
  }

  getUser(id){
    return this.users.filter(user => user.id===id)[0];
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
