

var app = {
  
  init() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.rooms = ['lobby'];
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
        var dataSanitized = _.filter(dataArr, function(message) {
          return (message['roomname'] !== undefined || message['username'] !== undefined 
            || !message.hasOwnProperty('username') || message['text'] !== undefined);
        });
        var roomSelected = $('#roomSelect').find(':selected').text();

        var dataRoom = _.filter(dataSanitized, function (message) {
          return (message['roomname'] === roomSelected);
        });
        for (var key in dataRoom) {
          var room = encodeURI(dataRoom[key]['roomname']);
          var username = encodeURI(dataRoom[key]['username']);
          var text = encodeURI(dataRoom[key]['text']);
          app.renderMessage(username, text, room);
        }

        for (var key in dataSanitized) {
          var rooma = encodeURI(dataSanitized[key]['roomname']);
          app.renderRoom(rooma);
        }
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
    app.clearMessages();
    app.fetch();
  },

  handleSubmit(user, text, room) {
    var message = {
      username: user,
      text: text,
      roomname: room
    };
    app.send(message);
  },
};


$(document).ready(function() {
  app.init();

  app.clearMessages();    
  app.fetch();
    
  $(this).on('click', '.username', function(event) {
    console.log('gotcha ya friend!');
    var myClasses = $(this).attr('class');
    var myClassesString = myClasses.split(' ');
    console.log(myClassesString[1]);
    app.handleUsernameClick(myClassesString[1]);
  });

  $('#send').on('submit', function(event) {
    event.preventDefault();
    var userSearch = window.location.search;
    var userArr = userSearch.split('=');
    var user = userArr[1];
    var text = $('#messageBox').val();
    var room = $('#roomSelect').find(':selected').text();
    app.handleSubmit(user, text, room);
  });

  $('#roomForm').on('submit', function(event) {
    event.preventDefault();
    var text = $('#roomBox').val();
    app.renderRoom(text);
  });

  $('#roomSelect').change(function(event) {
    app.clearMessages();
    app.fetch();
  });
});