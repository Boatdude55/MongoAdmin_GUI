"use strict";

var adminModule = angular.module("MongoAdminApp", []);

adminModule.factory("parsingUtilities", function () {
    /**
     * Service for parsing document.nodes
     * */
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
    
    return parsingUtilities;
});

adminModule.factory("xmlToJsonFactory", [ 'parsingUtilities', function ( parsingUtilities ) {
    /**
     * Service for convertin xml obj to json object
     * */
    var xmlToJson;
    
    xmlToJson = function ( xml ) {
        	
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
        	//return JSON.stringify(obj);
        	return obj;
        };
        
    return xmlToJson;
}]);

adminModule.factory("xmlReaderFactory", ['xmlToJsonFactory', function ( xmlToJsonFactory ) {
    /**
     * Service reading a file and returnin json representation
     * */
    return function ( file, callback ) {
    
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
           
           var jsonStr = xmlToJsonFactory(xmlDoc);
           callback(jsonStr);
           
        }catch ( err ) {
            
          console.log(err);
          
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
}]);

/**
 * Parent controller fileUIController
 * */
var formController = adminModule.controller("formController",['$scope','$element',
    function ( $scope, $element ) {
        
}]);

/**
 * Directive for input type=file
 * Angular does not support controller/view binding for input type
 * creating directive as attribute:'A'
 * This workaround enables treating input like a model
 * template credit to https://angularjs.org/ and http://www.folio3.com/blog/angularjs-file-upload-example-tutorial/
 * 
 * */
adminModule.directive("inputFileModel", [ '$parse', function ( $parse ) {
    /**
     * Directive for input type file
     * */
    return {
      restrict: 'A',
      scope: false,
      link: function ( scope, element, attrs ) {
        
        //var files = [];
        scope.data = {
          model: null,
          files: []
        };
        element.bind('change', function(){
             
            scope.data.files = [];   
            for ( var i = 0; i < 5; i++ ) {

                scope.data.files.push({
                    obj:element[0].files.item(i),
                    id: i
                });
            }
            
            //$parse(attrs.inputFileModel).assign(scope,files);
             scope.$apply();
        });
        
      }
    };    
}]);

adminModule.directive("inputFileList", function () {
    /**
     * Directive for select using ng-Value
     * */
    return {
      restrict: 'A',
      scope: false,
      controller:[ '$scope', '$element', '$attrs', 'xmlReaderFactory', function ( $scope, $element, $attrs, xmlReaderFactory ) {
        
            $scope.clicked = function ( $event ) {
                
                var key = $scope.data.model;
                var xml;
                var match;
                
                for ( var i = 0; i < $scope.data.files.length; i++ ) {
                    
                    match = $scope.data.files[i].obj.name === key;
                    if ( match ) {
                        xml = $scope.data.files[i].obj;
                        break;
                    }
                }
                
                xmlReaderFactory( xml, function ( result ) {
                    $scope.data.json = result;
                    $scope.$apply();
                });
            };
      }],
      replace: true
    };   
});

adminModule.directive("inputFilePreview", function () {
    /**
     * Directive for div that previews json
     * */
    return {
      restrict: 'A',
      scope: true,
      template: '<pre><code>{{data.json}}</code></pre>',
      replace: true
    };   
});