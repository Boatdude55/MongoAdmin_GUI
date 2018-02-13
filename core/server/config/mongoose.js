var config = require('../config');
var mongoose = require('mongoose');

module.exports = function() {
  console.log("starting connection");
  var result;
  mongoose.connect(config.db, function (err) {
    if (err) throw err;
  });
  
  var db = mongoose.connection();
  
  db.on('error', function () {
    
    result = 0;
    console.error.bind(console, 'connection error:');
    
  });
  
  db.once("open", function () {
      result = 1;
      console.log("Mongoose connected to database");
  });

  return result;
};