var app = {
  init() {
    this.send = function(message) {
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
        }
      })
    }

    this.fetch = function () {
      $.ajax({
        
      })
    }
  }
};

