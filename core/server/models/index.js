module.exports.addDocument = function ( model ) {
    
    model.save(function ( err, model ) {
        
        if (err){
           return console.error(err); 
        } 
        
    });
};