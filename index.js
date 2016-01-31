try {
  require('dotenv').load();
} catch(error) {
  console.log(error);
}
var express = require('express'), app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var server = require('http').Server(app);
var cors = require('cors');
var authService = require('./services/auth');


app.use(express.static(__dirname + '/front-end/public'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(authService);


app.get('/', function(request, response, next) {
  response.type('.html');
  var page = request.user ? 'index.html' : 'login.html';
  require('./services/socket')(server, request.user);
  response.sendFile([__dirname, 'front-end', page].join('/'));
});



var auth = require('./routes/auth');
var users = require('./routes/users');
var chatrooms = require('./routes/chatrooms');
app.use('/auth', auth)
app.use('/api/users', users);
app.use('/api/chatrooms', chatrooms);


server.listen(port, function() {
  console.log('Server is listening on port', port);
});


// Error Handling
if (process.env.NODE_ENV === 'development') {
  app.use(function(error, request, response, next) {
    response.status(error.status || 500);
    response.json({
      message: error.message,
      error: error
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(error, request, response, next) {
  response.status(error.status || 500);
  response.json({
    message: error.message,
    error: {}
  });
});
