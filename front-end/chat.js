var socket = io();
socket.on('chat message', function(response) {
  var message = wrap(response.message, 'span class="message"');
  var name = wrap('@' + response.user, 'span class="user"');
  var date = wrap(response.date, 'time');
  $('ul#messages').append('<li>' + date + ', ' + name + ': ' + message + '</li>');
});

socket.on('typing', function(message) {
  $('.typer').text(message);
});

$(document).ready(function() {
  $('form button').click(function(event) {
    if (event) event.preventDefault();
    var message = $('input#m').val();
    var name = $('input#name').val();
    if (message && name) {
      socket.emit('typing', {});
      socket.emit('chat message', { message: message, user: name });
      $('input#m').val('');
    }
  });
  $('form input').on('keyup', function(event) {
    var user = $(this).val() ? $('input#name').val() : '';
    socket.emit('typing', { user: user });
  });
});

function wrap(string, tag) {
  return '<' + tag + '>' + string + '</' + tag.split(' ')[0] + '>';
}
