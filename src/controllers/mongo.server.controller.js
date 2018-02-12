module.exports.init = function ( req, res, next ) {
 
    var child_process = require("child_process");
    var db = require("../config").dbInit;

    var mongod = child_process.spawn("mongod", ["--bind_ip=$IP", "--dbpath=data", "--nojournal", "--rest '$@'"]);
    mongod.on('error', (err) => {
      console.log('Failed to start subprocess.', err.name, err.message);
    });
    /*var options = {
        cwd: __dirname,
        encoding: 'utf8',
        shell: process.env.PATH,
        timeout: 0,
        uid: process.getuid(),
        gid: process.getgid(),
        windowsHide: true
    };
    
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
    */
};

module.exports.stop = function ( req, res, next ) {

    var child_process = require("child_process");
    var db = require("../config").dbShutDown;
    
    /*
    child_process.exec(db, function ( error, stdout, stderr ) {
        
        if ( error === null ) {
            
            console.log(`stdout: ${stdout}`);
            res.status(200).send("Stopped MongoDB");
            
        }else {
            
            next(error);
        }
    });
    */
};