'use strict';

/**
 * @ngdoc directive
 * @name b2bannerApp.directive:pager
 * @description
 * # pager
 */
var linkFunc = function( scope ){
    
    var setupPager = function(){
        var pageCount = ( scope.paginationObj.targ === null ) ? 0 : Math.ceil( scope.paginationObj.targ.length / scope.paginationObj.perPage );
        scope.paginationObj.pager = [];
        scope.paginationObj.currentPage = 1;
        for( var i = 1; i <= pageCount; i++ ){
            scope.paginationObj.pager.push( i );
        }
    };
    
    scope.goToPage = function( targPage ){
        scope.paginationObj.currentPage = targPage;
    };
    scope.nextPage = function( disabled ){
        if( !disabled ){
            scope.goToPage( scope.paginationObj.currentPage + 1 );
        }
    };
    scope.previousPage = function( disabled ){
        if( !disabled ){
            scope.goToPage( scope.paginationObj.currentPage - 1 );
        }
    };
    
    scope.$watch( function( scope ){
        return scope.paginationObj.targ;
    }, function(){
        setupPager();
    } );
    
    scope.$watch( function( scope ){
        return scope.paginationObj.changeWatch;
    }, function(){
        setupPager();
    } );
    
    scope.$watch( function( scope ){
        return scope.paginationObj.perPage;
    }, function(){
        setupPager();
    } );
};

angular.module('b2bannerApp')
.directive('pager', function () {
    return {
        templateUrl: 'views/admin/paginationTemplate.html',
        link: linkFunc,
        scope: {
            paginationObj:'=paginationobj',
        }
    };
});
