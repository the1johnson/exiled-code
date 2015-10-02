'use strict';

/**
 * @ngdoc function
 * @name storeFrontFinishApp.controller:StoreFrontFinishController
 * @description
 * # StoreFrontFinishController
 * Controller of the storeFrontFinishApp
 */
angular.module('storeFrontFinishApp')
.controller('StoreFrontFinishController', function ($scope, storeFrontOrderOptions, manageAlerts) {
    var syncFactoryWithScope = function(){
            storeFrontOrderOptions.itemPolePocket = $scope.storeFrontOptions.itemPolePocket;
            storeFrontOrderOptions.itemPolePocketSides = $scope.storeFrontOptions.itemPolePocketSides;
            storeFrontOrderOptions.itemBleed = $scope.storeFrontOptions.itemBleed;
            storeFrontOrderOptions.itemBleedSides = $scope.storeFrontOptions.itemBleedSides;
            storeFrontOrderOptions.itemHem = $scope.storeFrontOptions.itemHem;
            storeFrontOrderOptions.itemHemSides = $scope.storeFrontOptions.itemHemSides;
            storeFrontOrderOptions.itemGrommet = $scope.storeFrontOptions.itemGrommet;
            storeFrontOrderOptions.itemGrommetSides = $scope.storeFrontOptions.itemGrommetSides;
            storeFrontOrderOptions.itemPacking = $scope.storeFrontOptions.itemPacking;
            storeFrontOrderOptions.itemWebbing = $scope.storeFrontOptions.itemWebbing;
            storeFrontOrderOptions.itemHstakes = $scope.storeFrontOptions.itemHstakes;
            storeFrontOrderOptions.itemEasels = $scope.storeFrontOptions.itemEasels;
            storeFrontOrderOptions.itemDrings = $scope.storeFrontOptions.itemDrings;
            storeFrontOrderOptions.itemComments = $scope.storeFrontOptions.itemComments;
        },
        setFinishingInputValues = function(){
            if( $scope.storeFrontOptions.polePocketDisabled ){
                $scope.storeFrontOptions.itemPolePocket = 'none';
            }
            if( $scope.storeFrontOptions.bleedDisabled ){
                $scope.storeFrontOptions.itemBleed = 'none';
            }
            if( $scope.storeFrontOptions.hemDisabled ){
                $scope.storeFrontOptions.itemHem = 'none';
            }
            if( $scope.storeFrontOptions.grommetDisabled ){
                $scope.storeFrontOptions.itemGrommet = 'none';
            }
            if( $scope.storeFrontOptions.packingDisabled ){
                $scope.storeFrontOptions.itemPacking = 'folded';
            }
            if( $scope.storeFrontOptions.webbingDisabled || $scope.storeFrontOptions.itemHem === 'none' ){
                $scope.storeFrontOptions.itemWebbing = 'none';
            }
            if( $scope.storeFrontOptions.hstakesDisabled ){
                $scope.storeFrontOptions.itemHstakes = 0;
            }
            if( $scope.storeFrontOptions.easelsDisabled ){
                $scope.storeFrontOptions.itemEasels = 0;
            }
            if( $scope.storeFrontOptions.dringsDisabled ){
                $scope.storeFrontOptions.itemDrings = 0;
            }
        },
        setFinishingStates = function(){
            
            $scope.storeFrontOptions.polePocketDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.polePocketDisabled;
            $scope.storeFrontOptions.bleedDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.bleedDisabled;
            $scope.storeFrontOptions.hemDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.hemDisabled;
            $scope.storeFrontOptions.grommetDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.grommetDisabled;
            $scope.storeFrontOptions.packingDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.packingDisabled;
            $scope.storeFrontOptions.webbingDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.webbingDisabled;
            $scope.storeFrontOptions.hstakesDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.hstakesDisabled;
            $scope.storeFrontOptions.easelsDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.easelsDisabled;
            $scope.storeFrontOptions.dringsDisabled = (storeFrontOrderOptions.selectedMaterial === 0) ? 1 : storeFrontOrderOptions.selectedMaterial.dringsDisabled;
            
            setFinishingInputValues();
            syncFactoryWithScope();
        },
        init = function(){
            manageAlerts.clearAlerts();
            /* SET DEFAULT SCOPE VARS */
            $scope.storeFrontOptions = {};
            $scope.storeFrontOptions.activeNavTab = 'finish';
            $scope.storeFrontOptions.artSizeSet = ( storeFrontOrderOptions.itemWidthIN === 0 && storeFrontOrderOptions.itemHeightIN === 0 ) || storeFrontOrderOptions.selectedMaterial === 0 ? 0 : 1;
            $scope.storeFrontOptions.navTemplate = storeFrontOrderOptions.navTemplate;
            $scope.storeFrontOptions.polePocketOptions = [ {displayKey:'None', inputVal:'none'}, {displayKey:'1 Inch', inputVal:'1in'}, {displayKey:'2 Inch', inputVal:'2in'}, {displayKey:'3 Inch', inputVal:'3in'}, {displayKey:'4 Inch', inputVal:'4in'}, {displayKey:'5 Inch', inputVal:'5in'}, {displayKey:'6 Inch', inputVal:'6in'} ];
            $scope.storeFrontOptions.bleedOptions = [ {displayKey:'None', inputVal:'none'}, {displayKey:'1 Inch', inputVal:'1in'}, {displayKey:'2 Inch', inputVal:'2in'}, {displayKey:'3 Inch', inputVal:'3in'}, {displayKey:'4 Inch', inputVal:'4in'}, {displayKey:'5 Inch', inputVal:'5in'}, {displayKey:'6 Inch', inputVal:'6in'} ];
            $scope.storeFrontOptions.hemOptions = [ {displayKey:'None', inputVal:'none'}, {displayKey:'1 Inch', inputVal:'1in'} ];
            $scope.storeFrontOptions.grommetOptions = [ {displayKey:'None', inputVal:'none'}, {displayKey:'Corners', inputVal:'corners'}, {displayKey:'18 Inch', inputVal:'18in'}, {displayKey:'24 Inch', inputVal:'24in'} ];
            $scope.storeFrontOptions.packingOptions = [ {displayKey:'Folded', inputVal:'folded'}, {displayKey:'Rolled', inputVal:'rolled'} ];
            $scope.storeFrontOptions.webbingOptions = [ {displayKey:'None', inputVal:'none'}, {displayKey:'1 Inch', inputVal:'1in'} ];
            
            $scope.storeFrontOptions.itemPolePocket = storeFrontOrderOptions.itemPolePocket;
            $scope.storeFrontOptions.itemPolePocketSides = storeFrontOrderOptions.itemPolePocketSides;
            $scope.storeFrontOptions.itemBleed = storeFrontOrderOptions.itemBleed;
            $scope.storeFrontOptions.itemBleedSides = storeFrontOrderOptions.itemBleedSides;
            $scope.storeFrontOptions.itemHem = storeFrontOrderOptions.itemHem;
            $scope.storeFrontOptions.itemHemSides = storeFrontOrderOptions.itemHemSides;
            $scope.storeFrontOptions.itemGrommet = storeFrontOrderOptions.itemGrommet;
            $scope.storeFrontOptions.itemGrommetSides = storeFrontOrderOptions.itemGrommetSides;
            $scope.storeFrontOptions.itemPacking = storeFrontOrderOptions.itemPacking;
            $scope.storeFrontOptions.itemWebbing = storeFrontOrderOptions.itemWebbing;
            $scope.storeFrontOptions.itemHstakes = storeFrontOrderOptions.itemHstakes;
            $scope.storeFrontOptions.itemEasels = storeFrontOrderOptions.itemEasels;
            $scope.storeFrontOptions.itemDrings = storeFrontOrderOptions.itemDrings;
            $scope.storeFrontOptions.itemComments = storeFrontOrderOptions.itemComments;
            
            if( storeFrontOrderOptions.selectedMaterial === 0 ){
                manageAlerts.setAlerts({
                    message:'Please select a material',
                    type:'alert-warning'
                });
            }
            
            setFinishingStates();
        };
    
    init();
    
    /* UPDATE storeFrontOrderOptions FACTORY ON UPDATE */
    $scope.storeFrontFinishingUpdate = function(){
        setFinishingInputValues();
        syncFactoryWithScope();
    };
});
