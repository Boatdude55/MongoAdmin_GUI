/**
 * Template credit to Stefan Fidanov
 * 
 * */

var mongoose = require('mongoose');

var state = {
  db: null,
};

module.exports.connect = function( url, callback ) {

  if ( state.db ) {
    
    return callback();
    
  }
  
  mongoose.connect(url, function ( err, db ) {
    
    if ( err ) {
      
      return callback(err);
      
    }
    state.db = db;
    callback();
    
  });
  
};

module.exports.get = function () {
  
  return state.db;
  
};

module.exports.close = function ( callback ) {
  
  if ( state.db ) {
    
    state.db.close( function ( err, result ) {
      
      state.db = null;
      state.mode = null;
      callback(err);
      
    });
    
  }
  
};