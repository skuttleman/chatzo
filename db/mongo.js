var mongo = require('mongodb');
var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/chat_app';
module.exports = {
  connect: function() {
    return new Promise(function(resolve, reject) {
      mongo.MongoClient.connect(url, function(err, db) {
        if (err) reject(err);
        else resolve(db);
      });
    });
  },
  ObjectId: mongo.ObjectId
}
