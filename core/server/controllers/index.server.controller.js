module.exports.render = function ( path , req, res, next ) {
 
    res.sendFile( path , function ( err ) {

        if( err ) {
            next(err);
        }   
    });
  
};

module.exports.update = function ( req, res, next ) {
    
    console.assert( req.body !== undefined , function () {
        res.status(500).send("JSON undefined");
    });
    //var mongoose = require("../config/mongoose").db;
    //var mongoAdmin = require("../model");//contains mongoose function for adding documents; save()
    //var model = require("../model/schemas");//folder contains models
    
    //var newModel = new model(req.body);
    res.status(200).send("Document recieved");
    
};