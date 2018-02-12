module.exports.post = function ( app ) {
    
    app.post("/mongo/start", function ( req, res, next ) {
        
        var mongo = require("../controllers/mongo.server.controller");
        mongo.init( req , res, next );
    });
    
    app.post("/mongo/stop", function ( req, res, next ) {
       
        var mongo = require("../controllers/mongo.server.controller");
        mongo.stop( req , res, next );
    });
    
    app.use(function ( err , req , res , next ) {
         
        res.status( 500 ).send("Process Failed: " + err.name +" , " + err.message);
        
    });
};