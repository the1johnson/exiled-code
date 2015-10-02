'use strict';

/**
 * @ngdoc function
 * @name storeFrontCartApp.controller:StoreFrontCartController
 * @description
 * # StoreFrontCartController
 * Controller of the storeFrontCartApp
 */
angular.module('storeFrontCartApp')
.controller('StoreFrontCartController', function ($scope, $location, storeFrontCartOptions, setLoginState) {
    var loginStatus = function( userType ){
            /* RETURNS logged in state (0,1) and access level (public, client, superuser etc) */
            //status, headers, config
            setLoginState.setLoggedIn().
                success(function(data) {
                    setLoginState.callStatus = 'success';
                    setLoginState.loggedIn = data.loggedInStatus;
                    $scope.ped = (data.access === 'superuser') ? true : false;//Allow superusers to edit price in cart
                    
                    if( !setLoginState.loggedIn ){
                        var path = ( userType === 'admin' ) ? '/admin-login' : '/';
                        $location.path( path );
                    }
                    
                }).
                error(function(data) {
                    setLoginState.callStatus = 'error';
                    setLoginState.data = data;
                    setLoginState.loggedIn = 0;
                });
        },
        updateCartItems = function(){
        /* GET THE CART ITEMS */
        //status, headers, config
        storeFrontCartOptions.getCartItems().
            success(function(data) {
                storeFrontCartOptions.cartItems = data;
                $scope.storeFrontOptions.cartItems = data;
                $scope.storeFrontOptions.cartItemCount = data.length;
                $scope.storeFrontOptions.checkoutDisabled = ( $scope.storeFrontOptions.cartItems.length > 0 ) ? 0 : 1;
                $scope.storeFrontOptions.clientID = ( data.length > 0 ) ? data[0].clientID : '';

            });
        },
        init = function(){
            var uType = ( $location.url().search('admin') !== -1 ) ? 'admin' : 'storeFront';
            loginStatus( uType );
            
            /* SET DEFAULT SCOPE VARS */
            $scope.storeFrontOptions = {};
            $scope.storeFrontOptions.deleteItem = { id:0, size:null, material:null };
            $scope.storeFrontOptions.duplicateItem = { id:0, size:null, material:null };
            $scope.storeFrontOptions.cartItems = {};
            $scope.pedObj = {};
            $scope.storeFrontOptions.checkoutDisabled = 1;
            
            updateCartItems();
        };
    
    init();
    
    $scope.duplicateCartItemPrompt = function(cartID, size, material){
        $scope.storeFrontOptions.duplicateItem.id = cartID;
        $scope.storeFrontOptions.duplicateItem.size = size;
        $scope.storeFrontOptions.duplicateItem.material = material;
        $('#duplicateModal').modal();
    };
    
    $scope.duplicateCartItem = function(){
        if( $scope.storeFrontOptions.duplicateItem.id ){
            storeFrontCartOptions.duplicateItem( $scope.storeFrontOptions.duplicateItem.id ).
                success(function(){
                    updateCartItems();
                    $('#duplicateModal').modal('hide');
                });
        }
    };
    
    $scope.deleteCartItemPrompt = function(cartID, size, material){
        $scope.storeFrontOptions.deleteItem.id = cartID;
        $scope.storeFrontOptions.deleteItem.size = size;
        $scope.storeFrontOptions.deleteItem.material = material;
        $('#deleteModal').modal();
    };
    
    $scope.deleteCartItem = function(){
        if( $scope.storeFrontOptions.deleteItem.id ){
            storeFrontCartOptions.deleteCartItem( $scope.storeFrontOptions.deleteItem.id ).
                success(function() {
                    updateCartItems();
                    $('#deleteModal').modal('hide');
                });
        }
    };
    
    $scope.cartArtImagePreview = function( artSrc, height, width ){
        var maxSize = 500,
            re = /(?:\.([^.]+))?$/,
            fWidth = width*10,
            fHeight = height*10,
            sizeMulti = ( fWidth > fHeight && fWidth > maxSize ) ? maxSize/fWidth : (fHeight > maxSize) ? maxSize/fHeight : 1,
            holdWidth = fWidth*sizeMulti,
            holdHeight = fHeight*sizeMulti,
            extension = re.exec(artSrc)[1],
            extensionRE = new RegExp( extension, '' ),
            prevArtSrc = ( artSrc !== '' && extension !== 'jpg' ) ? artSrc.replace( extensionRE, 'jpg' ) : artSrc,
            returnSrc = ( artSrc === '' ) ? 'http://placehold.it/'+holdWidth+'x'+holdHeight+'?text='+width+'in+x+'+height+'in' : './images/previews/'+$scope.storeFrontOptions.clientID+'/'+prevArtSrc;
        return returnSrc;
    };

    $scope.pedStart = function ( cartID, prevSub ) {
        $scope.pedObj.prevSub = prevSub;
        $scope.pedObj.cartID = cartID;
        $('#pedModal').modal();
    };

    $scope.addCustomEdit = function ( newSub ) {
        var edit = {cartID : $scope.pedObj.cartID, newSub : newSub };

        storeFrontCartOptions.editSub( edit ).success(function( data ){
            if (data === 'updated') {
                updateCartItems();
                $('#pedModal').modal('hide');
            }
        });
        
    };

    $scope.updateQtyCart = function( cartID, quantity, $index ) {
        quantity = (parseInt(quantity)) ? parseInt(quantity) : 1;
        $scope.storeFrontOptions.cartItems[$index].quantity = quantity;
        var postReq = {cartID : cartID, quantity : quantity};
        storeFrontCartOptions.updateQtyCart( postReq ).success(function( data ){
            if (data === 'qtyUpdated') {
                //update scope subtotal
                updateCartItems();
                //$scope.storeFrontOptions.cartItems[$index].subtotal = $scope.storeFrontOptions.cartItems[$index].pricePoint
            } else {
                console.log(data);
            }
        });
    };
});
