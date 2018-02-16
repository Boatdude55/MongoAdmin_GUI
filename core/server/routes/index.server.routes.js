
module.exports.get = function ( path , app ) {
    
    var index = require("../controllers/index.server.controller");
    
    app.get('/', function ( req , res , next ) {
         
        index.render( path , req, res, next );

    });
    
    app.use( function ( err , req , res , next ) {
         
        res.status( err.status || 404 );
        
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    
    app.use();
    
};

module.exports.post = function ( app ) {
    
    var index = require("../controllers/index.server.controller");
    var bodyParser = require('body-parser');
    
    app.use(bodyParser.json());

    app.post('/', function ( req, res, next ) {
        
        index.update( req, res, next );
        
    });
    
    app.use( function ( err, req, res, next ) {
        
        if(err){
            
            res.status(500).send("JSON undefined");
        }
    });
};