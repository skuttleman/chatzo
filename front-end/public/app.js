var appvars = {
  socket: io(),
  users: [],
  user: {},
  chatrooms: [],
  currentRoom: 1
}, ajax = {
  post: promisifyAjax('post'),
  get: promisifyAjax('get'),
  put: promisifyAjax('put'),
  delete: promisifyAjax('delete')
};

$(document).ready(function() {
  $('form.message-form').submit(postMessage);
  ajax.get('/api/users/logged-in').then(renderUsers);
  ajax.get('/api/chatrooms').then(renderChatrooms);
  ajax.get('/api/chatrooms/' + appvars.currentRoom + '/messages').then(renderMessages);
});

function postMessage(event) {
  if (event) event.preventDefault();
  var url = ['/api/chatrooms', appvars.currentRoom, 'messages'].join('/');
  var $input = $('input.message-text');
  ajax.post(url, { message: $input.val() });
  $input.val('');
}

function renderUsers(data) {
  appvars.users = data.users;
  writeToUL('.users-list', appvars.users);
}

function renderChatrooms(data) {
  appvars.chatRooms = data.chat_rooms;
  writeToUL('.chat-rooms-list', appvars.chatRooms);
}

function renderMessages(data) {
  var room = appvars.currentRoom;
  var index = findIt(appvars.chatRooms, appvars.currentRoom, 'id');
  if (index >= 0) {
    appvars.chatRooms[index].messages = data.messages;
  }
  writeToUL('.chat-messages', data.messages, formatMessage);
}

function promisifyAjax(method) {
  return function(url, data) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        method: method,
        url: url,
        data: data
      }).done(resolve).fail(reject);
    });
  };
}

function writeToUL(selector, list, formatter) {
  $(selector).html('');
  list.forEach(function(item) {
    appendToUL(selector, item, formatter);
  });
}

function appendToUL(selector, item, formatter) {
  var element = formatter ? formatter(item) : '<li data-id="' + item.id + '">' + item.name + '</li>';
  var clickHandler = makeClickHandler(selector);
  $(selector).append(element);
  if (clickHandler) {
    $(selector + ' > *:last-child').click(clickHandler);
  }
}

function makeClickHandler(selector) {
  switch(selector) {
    case '.users-list':
      return;
    case '.chat-rooms-list':
      return function() {
        switchChatRooms(this.dataset.id);
      };
    case '.chat-messages':
      return;
  }
}

function switchChatRooms(room) {
  // TODO: set active li

  appvars.currentRoom = Number(room);
  var index = findIt(appvars.chatRooms, { id: room }, 'id');
  if (index >= 0) {
    if (appvars.chatRooms[index].messages) {
      renderMessages({ messages: appvars.chatRooms[index].messages });
    } else {
      ajax.get('/api/chatrooms/' + room + '/messages').then(renderMessages);
    }
  }
}

function formatMessage(message) {
  return [
    '<li data-id="',
    message.id,
    '"><span class="message-user">@',
    message.user.name,
    '</span><time class="message-date">',
    chatDate(message.created_at),
    '</time><p class="message-body">',
    message.message,
    '</p></li>'
  ].join('');
}

function chatDate(string) {
  var date = new Date(string);
  return [
    [
      date.getMonth() + 1,
      date.getDate(),
      date.getYear() - 100
    ].join('/'),
    [
      date.getHours() % 12 || 12,
      pad(date.getMinutes()),
      pad(date.getSeconds()),
    ].join(':')
  ].join(' ') + (date.getHours() >= 12 ? 'PM' : 'AM');
}

function pad(number) {
  var string = String(number);
  if (string.length < 2) string = '0' + string;
  return string;
}

function findIt(array, item, key) {
  for (var i = 0; i < array.length; i++) {
    if ((key && item[key] == array[i][key]) || (!key && item == array[i])) {
      return i;
    }
  }
  return -1;
}

appvars.socket.on('chat message', function(message) {
  var room = message.chat_room_id;
  var index = findIt(appvars.chatRooms, { id: room }, 'id');
  if (index >= 0) {
    if (appvars.chatRooms[index].messages) {
      appvars.chatRooms[index].messages.push(message);
    }
    // TODO: clean messages
    if (room == appvars.currentRoom) {
      appendToUL('.chat-messages', message, formatMessage);
    }
  }
});
