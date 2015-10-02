'use strict';

/**
 * @ngdoc function
 * @name storeFrontCheckoutApp.controller:StoreFrontCheckoutController
 * @description
 * # StoreFrontCheckoutController
 * Controller of the storeFrontCheckoutApp
 */
angular.module('storeFrontCheckoutApp')
.controller('StoreFrontCheckoutController', function ($scope, $compile, $location, $filter, storeFrontCartOptions) {
    var submitStateCheck = function(){
            var submitDisabled = 0,
                paramKey = null,
                notRequired = [ 'reference', 'notes', 'attention', 'addressTwo', 'saveClientInfo' ];
            /* IF ANY CHECKOUT INPUTS ARE EMPTY THEN DISABLE SUBMIT BUTTON */
            for( paramKey in $scope.storeFrontOptions.checkoutParams ){
                submitDisabled = ( notRequired.indexOf( paramKey ) === -1 && ( !$scope.storeFrontOptions.checkoutParams[paramKey] || $scope.storeFrontOptions.checkoutParams[paramKey] === '') ) ? 1 : submitDisabled;
            }
                
            $scope.storeFrontOptions.submitOrderDisabled = submitDisabled;
        },
        syncFactoryWithScope = function(){
            storeFrontCartOptions.checkoutParams = $scope.storeFrontOptions.checkoutParams;
        },
        updateCartItems = function(){
            /* GET THE CART ITEMS */
            //status, headers, config
            storeFrontCartOptions.getCartItems().
                success(function(data) {
                    storeFrontCartOptions.cartItems = data;
                    $scope.storeFrontOptions.clientID = data[0].clientID;
                });
        },
        autoFillClients = function(inputID){
            var inputVal = angular.element( '#'+inputID ).val(),
                returnVal = 0,
                filterVar = {},
                idTranslator = { orderCompanyName:'shiptoCompany', orderAddress1:'shiptoAddress1', orderCity:'shiptoCity', orderZipcode:'shiptoZipcode', orderAttention:'shiptoAttention', orderAddress2:'shiptoAddress2', orderState:'shiptoState' };
                
            filterVar[ idTranslator[inputID] ] = inputVal;
            
            var filteredClients = $filter( 'filter' )( $scope.clientAddressList, filterVar ),
                returnString = filteredClients.length > 0 ? '<ul class="autoFillClients">' : '';
                
            for( var i = 0, k = filteredClients.length; i<k; i++ ){
                returnString += '<li><a ng-click="autoFillByID('+filteredClients[i].recordID+')">'+filteredClients[i].shiptoCompany+'</a></li>';
            }
            
            returnString += filteredClients.length > 0 ? '</ul>' : '';
            returnVal = returnString !== '' ? $compile(returnString)($scope) : 0;
            
            return returnVal;
        },
        handleAutoFillPopover = function( targPopoverID ){
            var options = {content:'', title:'Client Auto Fill', placement:'top', trigger:'manual', html:true},
                autoFillContent = autoFillClients( targPopoverID );
            
            if( !autoFillContent ){
                $('#'+$scope.popOverOpts.active).popover('hide');
                return ;
            }
            
            if( $scope.popOverOpts.active !== targPopoverID ){
                $('#'+$scope.popOverOpts.active).popover('destroy');
                options.content = autoFillContent;
                $('#'+targPopoverID).popover(options);
            }else{
                var popover = angular.element('#'+targPopoverID).data('bs.popover');
                popover.options.content = autoFillContent;
            }
            $('#'+targPopoverID).popover('show');
            
            $scope.popOverOpts.active = targPopoverID;
        },
        init = function(){
            /* IF CART ITEMS ARE NOT IN THE FACTORY THEN GET THEM THERE */
            if( !storeFrontCartOptions.cartItems ){
                updateCartItems();
            }
            
            /* SET DEFAULT SCOPE VARS */
            $scope.clientAddressList = {};
            $scope.storeFrontOptions = {};
            $scope.popOverOpts = { active:'' };
            $scope.storeFrontOptions.submitOrderDisabled = 1;
            $scope.storeFrontOptions.checkoutParams = storeFrontCartOptions.checkoutParams;
            //$scope.storeFrontOptions.checkoutParams = { reference:'Ref', contactName:'Name', contactEmail:'Email@e.mail', notes:'Notes', company:'Company', addressOne:'Addr1', city:'City', zipcode:'Zip', attention:'Attent', addressTwo:'Addr2', state:'CO', shipMethod:'upsgnd' };
            $scope.storeFrontOptions.shipMethods = [ {displayKey:'Ground', inputVal:'upsgnd'}, {displayKey:'3 Day Select', inputVal:'ups3day'}, {displayKey:'2nd Day', inputVal:'ups2day'}, {displayKey:'Next Day', inputVal:'ups1day'}, {displayKey:'Next Day Saver', inputVal:'ups1daysave'}, {displayKey:'Next Day Early A.M.', inputVal:'upsnextdayam'}, {displayKey:'Pickup At Printer', inputVal:'pickup'} ];
            $scope.storeFrontOptions.abbrevStateList = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
            submitStateCheck();
            
            storeFrontCartOptions.getClientAddressList().
                success(function(data){
                    $scope.clientAddressList = data;
                });
        };
    init();
    
    $scope.checkoutParamsUpdated = function( updatedID, checkAutoFill ){
        if( checkAutoFill ){
            handleAutoFillPopover( updatedID );
        }
        syncFactoryWithScope();
        submitStateCheck();
    };
    
    $scope.submitOrderPrompt = function(){
        $('#submitModal').modal();
    };
    
    $scope.submitOrder = function(){
        //data, status, headers, config
        storeFrontCartOptions.submitOrder().
            success(function() {
                storeFrontCartOptions.checkoutParams = { reference:'', contactName:'', contactEmail:'', notes:'', company:'', addressOne:'', city:'', zipcode:'', attention:'', addressTwo:'', state:'CO', shipMethod:'upsgnd' };
                $('#submitModal').on('hidden.bs.modal', function (){
                    $scope.$apply(function(){
                        $location.path( '/admin-main' );
                    });
                });
                $('#submitModal').modal('hide');
            });
    };
    
    $scope.toggleSaveClientInfo = function(){
        $scope.storeFrontOptions.checkoutParams.saveClientInfo = !$scope.storeFrontOptions.checkoutParams.saveClientInfo;
        syncFactoryWithScope();
    };
    
    $scope.autoFillByID = function( recordID ){
        for( var i = 0, k = $scope.clientAddressList.length; i<k; i++ ){
            
            if( parseInt($scope.clientAddressList[i].recordID) === parseInt(recordID) ){
                $('#'+$scope.popOverOpts.active).popover('hide');
                $scope.storeFrontOptions.checkoutParams.company = $scope.clientAddressList[i].shiptoCompany;
                $scope.storeFrontOptions.checkoutParams.state = $scope.clientAddressList[i].shiptoState;
                $scope.storeFrontOptions.checkoutParams.addressOne = $scope.clientAddressList[i].shiptoAddress1;
                $scope.storeFrontOptions.checkoutParams.addressTwo = $scope.clientAddressList[i].shiptoAddress2;
                $scope.storeFrontOptions.checkoutParams.attention = $scope.clientAddressList[i].shiptoAttention;
                $scope.storeFrontOptions.checkoutParams.city = $scope.clientAddressList[i].shiptoCity;
                $scope.storeFrontOptions.checkoutParams.zipcode = $scope.clientAddressList[i].shiptoZipcode;
                $scope.storeFrontOptions.checkoutParams.saveClientInfo = 0;
                syncFactoryWithScope();
            }
        }
    };

    $scope.editClientAddressList = function() {
        console.log('cl');
    };
});
