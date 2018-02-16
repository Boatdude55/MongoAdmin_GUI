/**
 * Various parsing utilites
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
 * */
 // Changes XML to JSON object
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
	return obj;
}

/**
 * reads files as text
 * converts XML string to XML DOM object
 * converts XML DOM object into JSON object
 * returns JSON object
 * */
function read ( file, callback ) {
    
    var parserDom = new DOMParser();
    var reader = new FileReader();
    var xmlDoc;
    
    reader.addEventListener( "loadend", function () {
    
      if ( this.readyState === 2 ) {

        try{
            
           xmlDoc = parserDom.parseFromString(reader.result,"text/xml");
           var jsonObj = xmlToJson(xmlDoc);
           callback(jsonObj , "/" , "application/json",function ( json ) {
               return JSON.stringify(json);
           });
           
        }catch(err){
            
          console.log(err);
          
        } 
      }
    
    }, false);
  
    try{

        reader.readAsText( file, "UTF-8" );
        
    }catch(err){
    
        console.log( "func(read): ",err.name, err.message );
    
    }
  
}

/**
 * creates xmlHTTPRequest obj
 * posts data, to url, with a callback
 * */
var xmlHttpHandler = function () {
        
    function createXHR () {
        
        try {
            return new XMLHttpRequest();
        } catch (err) {
            console.log(err.name, err.message);
            return 0;
        }
    }
    
    this.post = function ( data, url, type, callback ) {
        
        var xhr = createXHR();
        
        if ( xhr !== 0 ){
            
            xhr.onreadystatechange=function() {
                
                if ( this.readyState === 4 && this.status === 200 ) {
                    
                    if ( this.responseText !== '' ) {
                        
                        document.getElementById("resText").innerHTML += ("<p class='log-entry'>" + this.responseText + "</p>");
                  
                    }
                }
            };
            
            try{
                
              //xhr.open("POST","/",true);
              xhr.open("POST",url,true);
              xhr.setRequestHeader("Content-type", type);
              xhr.send( callback(data));
              //xhr.send( JSON.stringify(data));
              
            }catch( err ) {
                
                console.log(err.name, err.message);
                
            }
        }
    
    };

};

window.addEventListener("load", function () {
    
    /**
     * @function reads a File Object as text; for an XML document object; converts XML object to JSON object; callback()
     **/
    
    
    var updateBtn = document.getElementById("update-btn");
    var connectBtn = document.getElementById("connect-db");
    var clickInput = document.getElementById("click-upload-input");
    var form = document.getElementById("form");
    
    form.addEventListener("submit", function (event) {

        event.preventDefault();
    });
    
    connectBtn.addEventListener("click", function ( event ) {
       
        var client = new xmlHttpHandler();
        var route = event.target.dataset["connection"] === "on"?"/mongo/stop":"/mongo/start";
        var status = event.target.dataset["connection"] === "on"? "off" : "on";

        client.post(status, route, "text/plain", function ( db ) {
            return db;
        });

        event.target.innerText = "Database"+ " " + status.toUpperCase();
        event.target.dataset["connection"] = status;
    });
    
    updateBtn.addEventListener("click", function () {

        var files = clickInput.files;
        console.assert(files.length > 0, "FileList is empty");
        console.assert(connectBtn.dataset["connection"] === "on", "MongoDB not connected");
        
        var client = new xmlHttpHandler();
        
        for ( var i = 0; i < files.length; i++ )  {
        
            read(files.item(i), client.post);

        }
    
    
    });
});
