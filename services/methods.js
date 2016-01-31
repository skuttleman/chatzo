module.exports = {
  pushUnique: function(array, item, key) {
    if (this.findIt(array, item, key) === -1) {
      array.push(item);
      return true;
    }
    return false;
  },
  findIt: function(array, item, key) {
    for (var i = 0; i < array.length; i++) {
      if ((key && array[i][key] == item[key]) || (!key && array[i] == item)) {
        return i;
      }
    }
    return -1;
  // },
  // datetime: function(value) {
  //   var date = new Date(value);
  //   return [
  //     [
  //       date.getMonth() + 1,
  //       date.getDate(),
  //       date.getYear() - 100
  //     ].join('/'),
  //     [
  //       date.getHours() % 12 || 12,
  //       pad(date.getMinutes()),
  //       pad(date.getSeconds()),
  //     ].join(':')
  //   ].join(' ') + (date.getHours() >= 12 ? 'PM' : 'AM');
  }
};
