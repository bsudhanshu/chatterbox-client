

var app = {
  
  init() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.rooms = ['All'];
    this.friends = [];
  },

  send(message) {
    $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    },
    });
  },

  fetch() {
    $.ajax({
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: {order: '-createdAt'},
    success: function (data) {
      var dataArr = data['results'];
      for (var key in dataArr) {
        var room = dataArr[key]['roomname'];
        var username = dataArr[key]['username'];
        var text = dataArr[key]['text'];
        app.renderRoom(room);
        app.renderMessage(username, text, room);
      };
    },
    error: function (data) {
      console.log('chatterbox: Failed to fetch messages');
      },
    });
  },

  clearMessages() {
    $('#chats').empty();
  },

  renderMessage(username, text, room) {
    if (this.friends.includes(username)) {
      $('#chats').append(
      `<div class="chat friend">
        <span class="username ${username}">${username}</span>
        <span>${text}</span>
      </div>`);
    } else {
      $('#chats').append(
        `<div class="chat">
          <span class="username ${username}">${username}</span>
          <span>${text}</span>
        </div>`);
    }
  },

  renderRoom(room) {
    if (!this.rooms.includes(room) && room !== undefined && room !== '') {
      this.rooms.push(room);
      $('#roomSelect').append(`<option>${room}</option>`);
    }
  },

  handleUsernameClick(username) {
    if (!this.friends.includes(username)) {
      this.friends.push(username);
    }
    app.fetch();
  },

  handleSubmit(message) {
    app.send(message);
    console.log("send");
  },
};


$(document).ready(function() {
  app.init();

  app.clearMessages();    
  app.fetch();
    
  $(this).on('click','.username', function(event) {
    console.log('gotcha ya friend!');
    var myClasses = $(this).attr("class");
    var myClassesString = myClasses.split(' ');
    console.log(myClassesString[1]);
    app.handleUsernameClick(myClassesString[1]);
  });

  $('#send').on('submit', function(event) {
    var userSearch = $(window.location.search);
    var userArr = userSearch.split('=');
    var user = userArr[1];
    console.log(user);
    app.handleSubmit(user, "help");
    event.preventDefault();
  });
  
});