module.exports.init = function ( req, res, next ) {
 
    var child_process = require("child_process");
    var config = require('../config');
    var db = require("../config/mongoose");
    
    
    child_process.exec( config.dbInit, function ( error, stdout, stderr ) {
        
        if ( error === null ) {
    
            console.log(`stdout: ${stdout}`);
            
            db.connect( config.db, function ( err ) {
                
              if ( err ) {
                  
                console.log('Unable to connect to Mongo.', err.name,err.message);
                return next(err);
        
              } else {
        

                  res.status(200).send("Started ALL MongoDB");
              }
            } );
            
        }else {
            
           return next(error);
        }
    });
    
};

module.exports.stop = function ( req, res, next ) {

    var child_process = require("child_process");
    var config = require('../config');
    var db = require("../config/mongoose");
    
    db.close( function ( err ) {
        
      if ( err ) {
          
        console.log('Unable to disconnect to Mongo.', err.name,err.message);
        return next(err);

      } else {

          console.log('Disconnected to Mongo....');
          
          child_process.exec( config.dbShutDown, function ( error, stdout, stderr ) {
                
                if ( error === null ) {
                    
                    console.log(`stdout: ${stdout}`);
                    
                }else {
                    
                    return next(error);
                }
            });
            
          res.status(200).send("Stopped ALL MongoDB");
      }
    } );
    
};