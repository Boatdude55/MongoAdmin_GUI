var express = require("./src/config/express");
var path = require("path");
var client =  module.exports = path.join(__dirname, "/src/client");
var index = path.join(__dirname,"/src/client/index.html");

var app = express(client, index , function ( err) {
  
  console.log("failed to serve:",err.name, err.message);
  
} );

var server = app.listen(process.env.PORT, process.env.IP, function ( err ) {
  
  if ( err ) {
    
    console.log("connection failure: ", err.name, err.message);
    
  }else {
    
    console.log("connetion success...listening:", "port(",process.env.PORT,")","ip(", process.env.IP,")");
  }
});