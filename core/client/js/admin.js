"use strict";

var adminModule = angular.module("MongoAdminApp", []);

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

    return {
      restrict: 'A',
      scope: false,
      link: function ( scope, element, attrs ) {
        
        var files = [];
        element.bind('change', function(){
                  
            for ( var i = 0; i < 5; i++ ) {

                files.push({
                    obj:element[0].files.item(i),
                    id: i
                });
            }
            
            $parse(attrs.inputFileModel).assign(scope,files);
             scope.$apply();
        });
        
      }
    };    
}]);

adminModule.directive("inputFileList", function () {
    
    return {
      restrict: 'A',
      scope: false,
      link: function ( scope ) {
          
      },
      controller:[ '$scope', '$element', '$attrs', function ( $scope, $element, $attrs ) {
        
      }],
      replace: true
    };   
});

adminModule.directive("inputFilePreview", function () {
    return {
      restrict: 'A',
      scope: true,
      template: '',
      replace: true
    };   
});