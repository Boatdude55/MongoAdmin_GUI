var config = require('../config');
var mongoose = require('mongoose');

module.exports.connection = function () {
  
  var db = mongoose.connection;
  
  return db;
  
};

module.exports.connect = function() {
  
  var db = mongoose.connect(config.db, function (err) {
    if (err) throw err;
  });

  return db;
};