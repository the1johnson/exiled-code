'use strict';

/**
 * @ngdoc function
 * @name storeFrontMaterialsApp.controller:StoreFrontMaterialsController
 * @description
 * # StoreFrontMaterialsController
 * Controller of the storeFrontMaterialsApp
 */
angular.module('storeFrontMaterialsApp')
.controller('StoreFrontMaterialsController', function ($scope, $location, setLoginState, storeFrontMaterialsList, storeFrontOrderOptions, manageAlerts) {
    var loginStatus = function( userType ){
            /* RETURNS logged in state (0,1) and access level (public, client, superuser etc) */
            //status, headers, config
            setLoginState.setLoggedIn().
                success(function(data) {
                    setLoginState.callStatus = 'success';
                    setLoginState.loggedIn = data.loggedInStatus;
                    
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
        setMatFilter = function( newMaterialFilter ){
            $scope.materialFilter.category = newMaterialFilter;
        },
        init = function(){
            var uType = ( $location.url().search('admin') !== -1 ) ? 'admin' : 'storeFront';
            loginStatus( uType );
            
            manageAlerts.clearAlerts();
            /* SET DEFAULT SCOPE VARS */
            $scope.storeFrontOptions = {};
            $scope.materialFilter = {};
            $scope.storeFrontOptions.itemReference = storeFrontOrderOptions.itemReference;
            $scope.storeFrontOptions.artSizeSet = ( storeFrontOrderOptions.itemWidthIN === 0 && storeFrontOrderOptions.itemHeightIN === 0 ) || storeFrontOrderOptions.selectedMaterial === 0 ? 0 : 1;
            $scope.storeFrontOptions.activeNavTab = 'materials';
            $scope.storeFrontOptions.navTemplate = storeFrontOrderOptions.navTemplate;
            $scope.storeFrontOptions.materialFilter = 'banner';
            $scope.storeFrontOptions.selectedMaterial = storeFrontOrderOptions.selectedMaterial;
            
        
            /* GET STORE FRONT MATERIALS FROM DATABASE */
            //, status, headers, config
            if( storeFrontMaterialsList.materialList.length === 0 ){
                storeFrontMaterialsList.setMaterialList().
                    success(function(data) {
                        storeFrontMaterialsList.callStatus = 'success';
                        storeFrontMaterialsList.data = data;
                        storeFrontMaterialsList.normalizeData();
                        
                        $scope.storeFrontOptions.filteredMaterials = storeFrontMaterialsList.materialList;
                        $scope.storeFrontOptions.categoryList = storeFrontMaterialsList.categoryList;
                    }).
                    error(function(data) {
                        storeFrontMaterialsList.callStatus = 'error';
                        storeFrontMaterialsList.data = data;
                    });
            }else{
                $scope.storeFrontOptions.filteredMaterials = storeFrontMaterialsList.materialList;
                $scope.storeFrontOptions.categoryList = storeFrontMaterialsList.categoryList;
            }
            
            setMatFilter( $scope.storeFrontOptions.materialFilter );
        };
    
    /* INITIALIZE STORE FRONT MATERIALS CONTROLLER */
    init();
    
    /* CHANGE STORE FRONT FILTER BASED ON BUTTON CLICKED */
    $scope.setStoreFrontMaterialFilter = function(filter){
        setMatFilter(filter);
    };
    
    /* UPDATE SELECTED MATERIAL IN storeFrontOrderOptions FACTORY */
    $scope.selectStoreFrontMaterial = function(){
        storeFrontOrderOptions.selectedMaterial = $scope.storeFrontOptions.selectedMaterial;
    };
    
    /* UPDATE ITEM REFERENCE */
    $scope.updateStoreFrontItemRef = function(){
        storeFrontOrderOptions.itemReference = $scope.storeFrontOptions.itemReference;
    };
});
