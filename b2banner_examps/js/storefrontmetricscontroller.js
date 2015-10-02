'use strict';

/**
 * @ngdoc function
 * @name storeFrontMaterialsApp.controller:StoreFrontMetricsController
 * @description
 * # StoreFrontMetricsController
 * Controller of the storeFrontMaterialsApp
 */
angular.module('storeFrontMaterialsApp')
.controller('StoreFrontMetricsController', function ($scope, $window, $timeout, storeFrontOrderOptions, manageAlerts) {
    var setMinMaxDimensions = function(){
            //NEED TO DO THIS
        },
        displayArtTemplate = function(){
            var widthInchesToPixels = storeFrontOrderOptions.itemWidthIN*72,
                heightInchesToPixels = storeFrontOrderOptions.itemHeightIN*72,
                resizeRatio = ( widthInchesToPixels > heightInchesToPixels ) ? widthInchesToPixels/heightInchesToPixels : heightInchesToPixels/widthInchesToPixels,
                displayWidth = (widthInchesToPixels >= heightInchesToPixels) ? '90%' : (90/resizeRatio)+'%',
                displayHeight = (heightInchesToPixels >= widthInchesToPixels) ? '90%' : (90/resizeRatio)+'%';
                
                storeFrontOrderOptions.templateWidth = displayWidth;
                storeFrontOrderOptions.templateHeight = displayHeight;
            $scope.storeFrontOptions.artTemplateStyle = { width:displayWidth, height:displayHeight, border:'1px solid black' };
        },
        setArtWrapper = function(){
            var wrapperWidth = angular.element(document.querySelectorAll('.artTemplateWrapper.'+$scope.storeFrontOptions.artTemplate))[0].clientWidth;
            $scope.storeFrontOptions.artTemplateWrapperStyle = { height:wrapperWidth+'px' };
        },
        updateStoreFrontOrderMetrics = function(){
            /* NORMALIZE SCOPE VARS */
            $scope.storeFrontOptions.itemQuantity = ($scope.storeFrontOptions.itemQuantity <= 0 || $scope.storeFrontOptions.itemQuantity === undefined) ? 1 : $scope.storeFrontOptions.itemQuantity;
            $scope.storeFrontOptions.itemWidthIN = ($scope.storeFrontOptions.itemWidthIN === undefined) ? 0 : $scope.storeFrontOptions.itemWidthIN;
            $scope.storeFrontOptions.itemHeightIN = ($scope.storeFrontOptions.itemHeightIN === undefined) ? 0 : $scope.storeFrontOptions.itemHeightIN;
            
            /* UPDATE THE FACTORY WITH THE CURRENT SCOPE VARS */
            storeFrontOrderOptions.itemQuantity = $scope.storeFrontOptions.itemQuantity;
            storeFrontOrderOptions.itemWidthIN = $scope.storeFrontOptions.itemWidthIN;
            storeFrontOrderOptions.itemHeightIN = $scope.storeFrontOptions.itemHeightIN;
            storeFrontOrderOptions.itemSides = $scope.storeFrontOptions.itemSides;
            $scope.storeFrontOptions.artTemplate = ($scope.storeFrontOptions.itemSides === '1') ? 'singleShow' : 'doubleShow';
            $scope.storeFrontOptions.artSizeSet = ( storeFrontOrderOptions.itemWidthIN === 0 || storeFrontOrderOptions.itemHeightIN === 0 ) || storeFrontOrderOptions.selectedMaterial === 0 ? 0 : 1;
            if( storeFrontOrderOptions.itemWidthIN !== 0 && storeFrontOrderOptions.itemHeightIN !== 0 ){
                setArtWrapper();
                displayArtTemplate();
            }
        },
        setDisabledStates = function(){
            $scope.storeFrontOptions.doubleSidedDisabled = storeFrontOrderOptions.selectedMaterial.doubleSidedDisabled;
            if( $scope.storeFrontOptions.doubleSidedDisabled ){
                $scope.storeFrontOptions.itemSides = '1';
            }
        },
        init = function(){
            manageAlerts.clearAlerts();
            /* SET DEFAULT SCOPE VARS */
            $scope.storeFrontOptions = {};
            $scope.metrics = { height:{ feet:0, inches:storeFrontOrderOptions.itemWidthIN }, width:{ feet:0, inches:storeFrontOrderOptions.itemHeightIN } };
            $scope.storeFrontOptions.artTemplateWrapperStyle = {};
            $scope.storeFrontOptions.artTemplateStyle = {};
            $scope.storeFrontOptions.artSizeSet = ( storeFrontOrderOptions.itemWidthIN === 0 && storeFrontOrderOptions.itemHeightIN === 0 ) ? 0 : 1;
            $scope.storeFrontOptions.activeNavTab = 'metrics';
            $scope.storeFrontOptions.navTemplate = storeFrontOrderOptions.navTemplate;
            $scope.storeFrontOptions.itemQuantity = storeFrontOrderOptions.itemQuantity;
            $scope.storeFrontOptions.itemWidthIN = storeFrontOrderOptions.itemWidthIN;
            $scope.storeFrontOptions.itemHeightIN = storeFrontOrderOptions.itemHeightIN;
            $scope.storeFrontOptions.itemSides = storeFrontOrderOptions.itemSides;
            $scope.storeFrontOptions.artTemplate = ($scope.storeFrontOptions.itemSides === '1') ? 'singleShow' : 'doubleShow';
            setDisabledStates();
            
            var w = angular.element($window);
            w.bind('resize', function () {
                setArtWrapper();
                $scope.$apply();
            });
            
            $scope.$watch('storeFrontOptions.artTemplate', function( newVal, oldVal){
                $timeout(function(){
                    if( oldVal !== newVal && ($scope.storeFrontOptions.itemWidthIN !== 0 || $scope.storeFrontOptions.itemHeightIN !== 0) ){
                        setArtWrapper();
                    }
                }, 30);
            });
            
            if( storeFrontOrderOptions.selectedMaterial !== 0 ){
                setMinMaxDimensions();
            }else{
                manageAlerts.setAlerts({
                    message:'Please select a material',
                    type:'alert-warning'
                });
            }
            if( storeFrontOrderOptions.itemWidthIN !== 0 && storeFrontOrderOptions.itemHeightIN !== 0 ){
                setArtWrapper();
                displayArtTemplate();
            }
        };
    init();
    
    /* CHANGE FUNCTION FOR UPDATING THE storeFrontOrderOptions FACTORY AND THE INPUT MAX VALS */
    $scope.storeFrontMetricsOptionsUpdated = function(){
        setMinMaxDimensions();
        updateStoreFrontOrderMetrics();
    };
    
    $scope.metricSizingUpdated = function(){
        $scope.storeFrontOptions.itemWidthIN = ($scope.metrics.width.feet*12) + $scope.metrics.width.inches;
        $scope.storeFrontOptions.itemHeightIN =($scope.metrics.height.feet*12) + $scope.metrics.height.inches;
        
        $scope.storeFrontMetricsOptionsUpdated();
    };
});
