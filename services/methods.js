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
  }
};
