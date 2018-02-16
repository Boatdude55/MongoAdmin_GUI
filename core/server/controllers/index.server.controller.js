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
    
    try{
        var mongoose = require("../config/mongoose").db;
        var mongooseAdmin = require("../models/index.model.controller.js");//contains mongoose function for adding documents; save()
        var model = require("../models/schemas");//folder contains models
        
        var newModel = new model.billSummary(req.body);

        res.status(200).send("Document recieved");
        
    }catch( err ) {
        
        console.log("Issue adding document",err.name, err.message);
        next(err);
    }
    
};