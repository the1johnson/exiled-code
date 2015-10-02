'use strict';

/**
 * @ngdoc function
 * @name adminProductsApp.controller:AdminProductsController
 * @description
 * # AdminProductsController
 * Controller of the adminProductsApp
 */
angular.module('adminProductsApp')
.controller('AdminProductsController', function ($scope, $timeout, adminPermissions, adminProductList) {
    var setNonrigidPriceEditObj = function(){
            var materialKey = 0,
                rangeKey = null;
            for( materialKey in $scope.productOptions.productList.nonrigid ){
                $scope.productOptions.priceEdits.nonrigid[ $scope.productOptions.productList.nonrigid[materialKey].material ] = { singlePricing:{}, doublePricing:{} };
                /* SINGLE SIDED PRICING IN NON RIGID EDIT OBJECT */
                for( rangeKey in $scope.productOptions.productList.nonrigid[materialKey].singleSidePrice ){
                    $scope.productOptions.priceEdits.nonrigid[ $scope.productOptions.productList.nonrigid[materialKey].material ].singlePricing[ $scope.productOptions.productList.nonrigid[materialKey].singleSidePrice[rangeKey].range ] = $scope.productOptions.productList.nonrigid[materialKey].singleSidePrice[rangeKey].cost;
                }
                /* DOUBLE SIDED PRICING IN NON RIGID EDIT OBJECT */
                for( rangeKey in $scope.productOptions.productList.nonrigid[materialKey].doubleSidedPrice ){
                    $scope.productOptions.priceEdits.nonrigid[ $scope.productOptions.productList.nonrigid[materialKey].material ].doublePricing[ $scope.productOptions.productList.nonrigid[materialKey].doubleSidedPrice[rangeKey].range ] = $scope.productOptions.productList.nonrigid[materialKey].doubleSidedPrice[rangeKey].cost;
                }
            }
        },
        setRigidPriceEditObj = function(){
            var materialKey = 0,
                sizeKey = null,
                rngI = 0,
                rngK = 0;
                
            for( materialKey in $scope.productOptions.productList.rigid ){
                $scope.productOptions.priceEdits.rigid[ $scope.productOptions.productList.rigid[materialKey].material ] = { singlePricing:{}, doublePricing:{} };
                /* SINGLE SIDED PRICING IN RIGID EDIT OBJECT */
                for( sizeKey in $scope.productOptions.productList.rigid[materialKey].singleSidePrice ){
                    $scope.productOptions.priceEdits.rigid[ $scope.productOptions.productList.rigid[materialKey].material ].singlePricing[ sizeKey ] = {};
                    for( rngI=0,rngK=$scope.productOptions.productList.rigid[materialKey].singleSidePrice[sizeKey].ranges.length; rngI<rngK; rngI++ ){
                        $scope.productOptions.priceEdits.rigid[ $scope.productOptions.productList.rigid[materialKey].material ].singlePricing[ sizeKey ][ $scope.productOptions.productList.rigid[materialKey].singleSidePrice[sizeKey].ranges[rngI].range ] = $scope.productOptions.productList.rigid[materialKey].singleSidePrice[sizeKey].ranges[rngI].cost;
                    }
                }
                
                /* DOUBLE SIDED PRICING IN RIGID EDIT OBJECT */
                for( sizeKey in $scope.productOptions.productList.rigid[materialKey].doubleSidedPrice ){
                    $scope.productOptions.priceEdits.rigid[ $scope.productOptions.productList.rigid[materialKey].material ].doublePricing[ sizeKey ] = {};
                    for( rngI=0,rngK=$scope.productOptions.productList.rigid[materialKey].doubleSidedPrice[sizeKey].ranges.length; rngI<rngK; rngI++ ){
                        $scope.productOptions.priceEdits.rigid[ $scope.productOptions.productList.rigid[materialKey].material ].doublePricing[ sizeKey ][ $scope.productOptions.productList.rigid[materialKey].doubleSidedPrice[sizeKey].ranges[rngI].range ] = $scope.productOptions.productList.rigid[materialKey].doubleSidedPrice[sizeKey].ranges[rngI].cost;
                    }
                }
            }
        },
        fetchProductList = function(){
            adminProductList.fetchProducts().
                success(function(data) {
                    adminProductList.products = data;
                    $scope.productOptions.productList = data;
                    setNonrigidPriceEditObj();
                    setRigidPriceEditObj();
                });
        },
        permissionsSetup = function(){
            /* CHECK IF ADMIN PERMISSIONS ARE SET IF NOT THEN SET THEM */
            adminPermissions.fetchPermissions().
                success(function(data) {
                    adminPermissions.setupPermissions( data );
                    $scope.productOptions.permissions.editPricing = adminPermissions.products.editPricing;
                });
        },
        saveMaterialPriceing = function(){
            adminProductList.editedPrices = $scope.productOptions.priceEdits[ $scope.productOptions.activeMats ];
            adminProductList.saveProducts( $scope.productOptions.activeMats ).
                success(function() {
                    $('#pricingSavedModal').modal();
                    $timeout( function(){
                        $('#pricingSavedModal').modal('hide');
                    }, 2000 );
                });
        },
        init = function(){
            /* SET DEFAULT SCOPE VARS */
            $scope.adminOpts = {};
            $scope.adminOpts.activeNavTab = 'products';
            $scope.adminOpts.adminNavTemplate = 'views/admin/navigation.html';
            
            $scope.productOptions = {};
            $scope.productOptions.permissions = {};
            $scope.productOptions.permissions.editPricing = 0;
            $scope.productOptions.activeMats = 'nonrigid';
            
            $scope.productOptions.productList = {};
            $scope.productOptions.rigidSizeList = [ {size:'12x18', sizeAdd:30}, {size:'18x24', sizeAdd:42}, {size:'24x24', sizeAdd:48}, {size:'24x32', sizeAdd:56}, {size:'24x48', sizeAdd:72}, {size:'36x48', sizeAdd:84}, {size:'48x48', sizeAdd:96}, {size:'48x96', sizeAdd:144} ];
            $scope.productOptions.priceEdits = { nonrigid:{}, rigid:{} };
            
            permissionsSetup();
            fetchProductList();
        };
        
    init();
    
    $scope.saveMaterialPricingClick = function(){
        saveMaterialPriceing( );
    };
    
    $scope.changePricingView = function(newView){
        $scope.productOptions.activeMats = newView;
    };
});
