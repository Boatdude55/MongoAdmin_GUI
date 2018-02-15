module.exports.post = function ( app ) {
    
    app.post("/mongo/start", function ( req, res, next ) {
        
        var mongo = require("../controllers/mongo.server.controller");
        mongo.init( req , res, next );
    });
    
    app.post("/mongo/stop", function ( req, res, next ) {
        console.log("starting shutdown process");
        var mongo = require("../controllers/mongo.server.controller");
        mongo.stop( req , res, next );
    });

    app.use("/mongo",function ( err , req , res , next ) {
 
        if ( err ) {
            
            res.status( 500 ).send("Process Failed: " + err.name +" , " + err.message);
            
        }
    });

};