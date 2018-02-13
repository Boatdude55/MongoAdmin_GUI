var express = require("express");

module.exports = function (staticPath , indexPath, callback ) {
  
    console.assert(typeof staticPath === "string", "static path is not a string");
    console.assert(typeof indexPath === "string", "index path is not a string");
    
    var app = express();
  
    try{
        
        app.use(express.static( staticPath ));
        var indexRouter = require('../routes/index.server.routes');
        var mongoRouter = require("../routes/mongo.server.routes");
        
        indexRouter.post(app);
        mongoRouter.post(app);
        
        return app;
        
    }catch ( err ) {
        
        callback(err);
    }
    
};