$(document).ready(function(){

  // var message = {
  //   'username': 'shawndrost',
  //   'text': 'trololo',
  //   'roomname': '4chan'
  // };
  function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
 };

  var getMessages = function(){
    $.ajax({
    // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log("Request for data SUCCESSFUL");
        // console.log(data);
        var messages = data.results;

        $('#messages').empty();

        for (var i = 0; i < messages.length; i++) {
          var message = messages[i];
          var text = htmlEscape(message.text);
          var user = htmlEscape(message.username);
          var time = htmlEscape(message.createdAt);
          var room = htmlEscape(message.roomname);

          var $message = $('<div>' +
            '<p>' + user +'</p>' +
            '<p>' + text +'</p>' +
            '<p>' + time +'</p>' +
            '<p>' + room +'</p>' +
            '</div>');

          $('#messages').append($message);
        }
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Request for data FAILED');
      }
    });
  };

  getMessages();
  // setInterval(getMessages, 3000);
  $("button").on("click", function(){
    getMessages();
  });

  // console.log(messages);





});
