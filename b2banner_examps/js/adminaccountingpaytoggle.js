'use strict';

/**
 * @ngdoc directive
 * @name adminAccountingApp.directive:adminAccountingPayToggle
 * @description
 * # adminAccountingPayToggle
 */
angular.module('adminAccountingApp')
.directive('adminAccountingPayToggle', function () {
    var linkFunc = function(scope, element, attrs){
        var active = false,
            orderNumber = attrs.ordernumber,
            orderTotal = attrs.ordertotal,
            clientID = attrs.orderclient;
            
            scope.glyphClass = 0;
            scope.active = active;
            
        element.bind('click', function(){
            
            /* IF THE ACTIVE CLIENT ID DOES NOT MATCH THE CURRENT CLIENT ID THEN SHOW ERROR */
            if( scope.activeClientID !== '' && scope.activeClientID !== clientID ){
                $('#clientFailModal').modal();
                return ;
            }
            
            active = !active;
            scope.$apply(function(){
                scope.active = active;
                
                if(active){
                    /* IF BUTTON IS ACTIVE THEN ACTIVATE THE PAY BUTTON / SET THE GLYP CLASS TO MINUS / PUSH THE ORDER INTO THE PAY LIST WITH ITS TOTAL */
                    scope.payButtonActive++;
                    scope.glyphClass = 2;
                    scope.orderPayList[ orderNumber ] = orderTotal;
                    scope.activeClientID = ( scope.payButtonActive === 1 ) ? clientID : scope.activeClientID;
                }else{
                    /* IF THERE ARE NOT SELECTED ORDERS THEN RESET CLIENTID */
                    scope.payButtonActive--;
                    scope.glyphClass = 0;
                    delete scope.orderPayList[ orderNumber ];
                    scope.activeClientID = ( scope.payButtonActive === 0 ) ? '' : scope.activeClientID;
                }
            });
        });
        
        element.bind('mouseenter', function(){
            scope.$apply(function(){
                scope.glyphClass = ( active ) ? 2 : 0;
            });
            
        });
        
        element.bind('mouseleave', function(){
            scope.$apply(function(){
                scope.glyphClass = ( active ) ? 1 : 0;
            });
            
        });
    };
    
    return {
        templateUrl: 'views/admin/glyphiconTemplate.html',
        link: linkFunc,
        scope: {
            orderPayList: '=paylist',
            payButtonActive: '=payactive',
            activeClientID: '=payclient'
        }
    };
});
