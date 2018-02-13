module.exports.init = function ( req, res, next ) {
 
    var child_process = require("child_process");
    var db = require("../config").dbInit;
    
    child_process.exec(db, function ( error, stdout, stderr ) {
        
        if ( error === null ) {
            
            console.log(`stdout: ${stdout}`);
            //var mongoose = require("../config/mongoose");
            //mongoose.connect();
            //var db = mongoose.connection();
            //db.once("open", function () {
            //    res.status(200).send("Started MongoDB");
            //});
            res.status(200).send("Started MongoDB");
        }else {
            
            next(error);
        }
    });
};

module.exports.stop = function ( req, res, next ) {

    var child_process = require("child_process");
    var db = require("../config").dbShutDown;
    

    child_process.exec(db, function ( error, stdout, stderr ) {
        
        if ( error === null ) {
            
            console.log(`stdout: ${stdout}`);
            res.status(200).send("Stopped MongoDB");
            
        }else {
            
            next(error);
        }
    });
};