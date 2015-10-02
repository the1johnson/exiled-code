'use strict';

/**
 * @ngdoc function
 * @name b2bannerApp.controller:StorefrontmanageclientscontrollerCtrl
 * @description
 * # StorefrontmanageclientscontrollerCtrl
 * Controller of the b2bannerApp
 */
angular.module('storeFrontManageClientsApp')
.controller('StoreFrontManageClientsController', function ( $scope, manangeClientInfo ) {
    /*var getObjIndex = function ( recordID ) {
        for (var i=0; i < $scope.addresses.length; i++) {
            if ($scope.addresses[i].recordID === recordID) {
                return i;
            }
        } 
        return -1;
    },*/
    var getClientAddrList = function(){
        manangeClientInfo.getClientAddressLists().
            success(function( data ){
                $scope.addresses = data;
                $scope.hasClients = ( data.length ) ? 1 : 0;
            });
    },
    init = function() {
        $scope.addresses = {};
        $scope.modal = {};
        $scope.adminOpts = {};
        $scope.adminOpts.activeNavTab = 'savedClients';
        $scope.adminOpts.adminNavTemplate = 'views/admin/navigation.html';
        getClientAddrList();
    };
    init();
    
    $scope.saveChanges = function( addr, $index ) {
        $scope.addresses[$index].saveBtnText = 'Saving...';
        manangeClientInfo.updateClientAddress( addr ).success(function(  ) {
            $scope.addresses[$index].saveBtnText = 'Saved';
        });     
    };

    $scope.registerChanges = function ( $index ) {
        $scope.addresses[$index].changesMade = true;
        $scope.addresses[$index].saveBtnText = false;
    };

    $scope.showDelete = function ( $index ) {
        $scope.modal.company = $scope.addresses[$index].shiptoCompany;
        $scope.modal.recordID = $scope.addresses[$index].recordID;
        $('#deleteModal').modal('show');
    };

    $scope.deleteAddress = function( recordID ) {
        manangeClientInfo.deleteClientAddress( recordID ).
            success(function() {
                $('#deleteModal').modal('hide');
                /*var deletedIndex = getObjIndex( recordID );
                $scope.addresses.splice(deletedIndex, 1);*/
                getClientAddrList();
            });
    };
    
    $scope.addClientModal = function(){
        //$scope.newSavedClientInfo = { saved:0, shiptoCompany:'', shiptoAttention:'', shiptoAddress1:'', shiptoAddress2:'', shiptoCity:'', shiptoState:'', shiptozipcode:'' };
        $scope.newSavedClientInfo = { saved:0, shiptoCompany:'company', shiptoAttention:'attention', shiptoAddress1:'addr1', shiptoAddress2:'addr2', shiptoCity:'city', shiptoState:'st', shiptozipcode:'80218' };
        $('#addSavedClientModal').modal('show');
    };
    
    $scope.addNewClient = function(){
        manangeClientInfo.addNewClient( $scope.newSavedClientInfo ).
            success(function(){
                $scope.newSavedClientInfo.saved = 1;
                getClientAddrList();
            });
    };
    
});
