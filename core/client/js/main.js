/**
 * Creates a new router for errors
 * @class
 * @this constructor
 * */
function ErrorHandler () {
    
    //var that = this;
    this.errElem = null;
    this.successElem = null;
    
}
/**
 * @function Route error to relevant html element
 * @param {File} src
 * */
ErrorHandler.prototype.readError = function ( err ) {

    if ( typeof err === "string" ) {
        
        this.errElem.innerHTML += ("<p class='bg-danger'>" + err + "</p>");
        
    }else{
        
        this.errElem.innerHTML += "<p class='bg-danger'>" + err.name + " : " + err.message +"</p>";
        
    }
};

ErrorHandler.prototype.readSuccess = function ( success ) {
    console.log(this);
    this.successElem.innerHTML += "<p class='bg-success'>" + success +"</p>";
    
};

/**
 * Various parsing utilites
 * @type {Object}
 **/
var parsingUtilities = {
    camelCaseFormat: function ( propertyName ) {
        /**
         * template credit to Mozilla
         * @function camelCaseFormat() 
         * @param {String} propertyName-name of current item in xml doc
         * @return {String}
         */
        function hyphenToUpper ( match, offset, string) {
        
            return match[1].toUpperCase(); 
            
        }
        return propertyName.replace( /(-|:)([a-z])/g, hyphenToUpper );
    },
    cleanObjKey: function ( keyName ) {
        /**
         * @function cleanObjKey() 
         * @param {String} keyName-name of future key in json obj
         * @return {String}
         */
        return keyName.replace(/#/g,'');
        
    },
    toNumber: function ( value ) {
        /**
         * @function isNumber() 
         * @param {String} value-textContent of xml node
         * @return {Number}
         */
        var test = /[^0-9]/.test(value);
    
        if ( value === "\n" || value === "\t") {
            value = '';
        }else if ( !test ) {
            
            var tmp = parseInt(value, 10);
            value =  tmp === isNaN ? parseFloat(value, 10) : tmp;
    
        }
        
        return value;
    }
    
};

/**
 * Template credit to David Walsh
 * Changes XML to JSON string
 * @param {XMLDocument} xml document to be parsed
 * @return {string} json string
 * */
function xmlToJson( xml ) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				var attrName = parsingUtilities.camelCaseFormat( parsingUtilities.cleanObjKey( attribute.nodeName ));
				obj["attributes"][attrName] = parsingUtilities.toNumber(attribute.nodeValue);
			}
		}
	} else if (xml.nodeType === 3) { // text
	
 
        obj =  parsingUtilities.toNumber(xml.textContent);
        
	} else if (xml.nodeType ===4) {
	    
	    obj = xml.nodeValue;

	}

	// do children
	if (xml.hasChildNodes() && xml.childNodes.length > 0) {
	 
		for(var i = 0; i < xml.childNodes.length; i++) {
            
			var item = xml.childNodes.item(i);
			var nodeName = parsingUtilities.camelCaseFormat( parsingUtilities.cleanObjKey(item.nodeName) );
			
			if (typeof(obj[nodeName]) === "undefined") {
			 
				obj[nodeName] = xmlToJson(item);
				
			}else if( item.nodeType ==="text" ) {
				if (typeof(obj[nodeName].push) === "undefined") {
				    
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return JSON.stringify(obj);
	//return obj;
}

/**
 * reads files as text
 * converts XML string to XML DOM object
 * converts XML DOM object into JSON object
 * returns JSON object
 * @param {File} file to read
 * @param {Function} callback function
 * */
function read ( file, callback ) {
    
    var parserDom = new DOMParser();
    var reader = new FileReader();
    var xmlDoc;
    
    reader.addEventListener( "loadend", function () {
    
      if ( this.readyState === 2 ) {

        try{
            
           xmlDoc = parserDom.parseFromString(reader.result,"text/xml");
        
           if ( xmlDoc.childNodes.length > 1 ) {

               var e = new Error("file is not xml");
               e.name = "Require XML";
               throw e;
               
           }
           
           var jsonObj = xmlToJson(xmlDoc);
           callback.comm.post(jsonObj , "/" , "application/json");
           
        }catch ( err ) {
            
          callback.logger.readError(err);
          
        } 
      }
    
    }, false);
  
    try{

        reader.readAsText( file, "UTF-8" );
        
    }catch( err ){
    
        //console.log( "func(read): ",err.name, err.message );
        throw err;
    }
  
}

/**
 * creates xmlHTTPRequest obj
 * posts data, to url, with a callback
 * @type {Function}
 * */
var xmlHttpHandler = function () {
     
    var that = this; 
    
    function createXHR () {
        
        try {
            return new XMLHttpRequest();
        } catch (err) {
            console.log(err.name, err.message);
            return 0;
        }
    }
    
    that.logger = new ErrorHandler();

    that.post = function ( err , data, url, type, callback ) {
        
        var xhr = createXHR();
        
        if ( arguments.length > 1 ) {
            
            console.log(arguments);
            if ( xhr !== 0 ){
                
                xhr.onreadystatechange=function() {
                    
                    if ( this.readyState === 4 ) {
                        if( this.status === 200 ) {
                        
                            if ( this.responseText ) {
         
                                that.logger.readSuccess(("<p class='bg-success'>" + this.responseText + "</p>"));
                          
                            }
                        }else {
                        
                                that.logger.readError(("<p class='bg-danger'>" + this.responseText + "</p>"));
                        }
                    }
                };
                
                try{
                  
                  xhr.open("POST",arguments[1],true);
                  xhr.setRequestHeader("Content-type", arguments[2]);
                  xhr.send(arguments[0]);
                  
                }catch( err ) {
                    
                    that.logger.readError(err);
                    //throw(err);
                }
            }
        }else {
            
            throw err;
        }
    
    };

};

window.addEventListener("load", function () {

    var clientConnect = new xmlHttpHandler();
    var serverRes = document.getElementById("resText");
    clientConnect.logger.errElem = serverRes;
    clientConnect.logger.successElem = serverRes;
    
    var clientUpdate = {
            comm : new xmlHttpHandler(),
            logger : new ErrorHandler()
        };
    var errorLog = document.getElementById("error-log");    
    clientUpdate.logger.errElem = errorLog;
    clientUpdate.logger.successElem = errorLog;
    clientUpdate.comm.logger.errElem = serverRes;
    clientUpdate.comm.logger.successElem =serverRes;

    var updateBtn = document.getElementById("update-btn");
    var connectBtn = document.getElementById("connect-db");
    var clickInput = document.getElementById("click-upload-input");
    var form = document.getElementById("form");
    
    form.addEventListener("submit", function (event) {

        event.preventDefault();
    });
    
    connectBtn.addEventListener("click", function ( event ) {
        
        var route = event.target.dataset["connection"] === "on"?"/mongo/stop":"/mongo/start";
        var status = event.target.dataset["connection"] === "on"? "off" : "on";

        clientConnect.post(status, route, "text/plain", function ( db ) {
            return db;
        });

        event.target.innerText = "Database"+ " " + status.toUpperCase();
        event.target.dataset["connection"] = status;
    });
    
    updateBtn.addEventListener("click", function () {

        var files = clickInput.files;
        
            console.assert(files.length > 0, "FileList is empty");
        
            console.assert(connectBtn.dataset["connection"] === "on", "MongoDB not connected");
        
        for ( var i = 0; i < files.length; i++ )  {
        
            try{
                
                read(files.item(i), clientUpdate);
                
            }catch ( err ) {
                
                clientUpdate.logger.readError(err);
                continue;
            }

        }
    
    });
});