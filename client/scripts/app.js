var chatRoom = function() {
  this.username;
  this.friends = [];
};

chatRoom.prototype.getMessages = function(room) {
  if (!room) {
    var data = {order: '-createdAt', limit: 50};
  } else {
    data = {order: '-createdAt', limit: 50, where: {roomname: room}};
  }

  var context = this;

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: data,
    contentType: 'application/json',
    success: function (data) {
      var messages = data.results;
      $('#messages').empty();

      for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        var text = _.escape(message.text);
        var user = _.escape(message.username);
        var time = _.escape(message.createdAt);
        var room = _.escape(message.roomname);
        var isFriend = false;
        var friendTest = function(){
          _.each(context.friends, function(friend){
            if (chatRoom.prototype.htmlEscape(friend) === user) {
              isFriend = true;
            };
          })
        };

        friendTest();

        var textForMessage = isFriend ? '<p class="bold_message">' + text +'</p>' : '<p>' + text +'</p>';
        var $message = chatRoom.prototype.formatHtmlMessage(user, textForMessage, time, room);

        $('#messages').append($message);
      }
    },
    error: function (data) {
      console.error('chatterbox: Request for data FAILED');
    }
  });
};

chatRoom.prototype.formatHtmlMessage = function(user, text, time, room) {
  return $('<div>' +
          '<p class="username">' + user +'</p>' +
          '<a href="#" class="follow_button">follow</a>' +
          text +
          '<p>' + time +'</p>' +
          '<a href=# class="chosen_room">' + room +'</a>' +
          '</div>');
};

chatRoom.prototype.formatMessage = function(message, chatroom){
  var formattedMessage = {
  'username':  this.username,
  'text':  message,
  'roomname': chatroom
  };
  this.postMessage(formattedMessage);
};

chatRoom.prototype.postMessage = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

$(document).ready(function(){

  var chatterbox = new chatRoom;
  chatterbox.getMessages();

  // setInterval(chatterbox.getMessages, 3000);
  $("#refresh").on("click", function(){
    chatterbox.getMessages();
  });

  $("#user_name").on("focusout",function(e){
    e.preventDefault();
    chatterbox.username = $("#user_name").val();
    //makes greeting from username
    var $greeting = $("<p id='greeting'>Hello,  " + chatterbox.username + "!</p>");
    $greeting.prependTo($("#main"));
    $("#user_name").remove();
  });

  $("#new_message").keypress(function(e){
    if (e.which === 13 || e.keycode === 13){
      e.preventDefault();
      var newMessage = $("#new_message").val();
      var newRoom = $('#new_room').val();
      $("#new_message").val("");
      $("#new_room").val("");
      chatterbox.formatMessage(newMessage, newRoom);
      chatterbox.getMessages();
    }
  });

  $("#main").on("click",".chosen_room", function(e){
    e.preventDefault();
    var room = $(this).text();
    chatterbox.getMessages(room);
  });

  $("#main").on("click",".follow_button", function(e){
      e.preventDefault();
      chatterbox.friends.push($(this).prev().text());
      chatterbox.getMessages();
    });


});
