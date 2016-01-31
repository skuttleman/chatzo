app.filter('chatdate', function() {
  return function(value) {
    var date = new Date(value);
    return [
      [
        date.getMonth() + 1,
        date.getDate(),
        date.getYear() - 100
      ].join('/'),
      [
        date.getHours() % 12 || 12,
        pad(date.getMinutes())
        // pad(date.getSeconds())
      ].join(':')
    ].join(' ') + (date.getHours() >= 12 ? 'PM' : 'AM');
  };
})

function pad(number) {
  var string = String(number);
  if (string.length < 2) string = '0' + string;
  return string;
}
