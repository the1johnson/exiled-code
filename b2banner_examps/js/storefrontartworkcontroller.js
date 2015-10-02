'use strict';

/**
 * @ngdoc function
 * @name storeFrontArtworkApp.controller:StoreFrontArtworkController
 * @description
 * # StoreFrontArtworkController
 * Controller of the storeFrontArtworkApp
 */
angular.module('storeFrontArtworkApp')
.controller('StoreFrontArtworkController', function ($scope, $location, $window, Upload, storeFrontOrderOptions, manageAlerts) {
    var syncFactoryWithScope = function(){
        storeFrontOrderOptions.itemArtSource = $scope.storeFrontOptions.itemArtSource;
            storeFrontOrderOptions.artRequestEmail = $scope.storeFrontOptions.artRequestEmail;
            storeFrontOrderOptions.previewSrc = $scope.storeFrontOptions.previewSrc;
            storeFrontOrderOptions.previewSrcTwo = $scope.storeFrontOptions.previewSrcTwo;
        },
        setArtWrapper = function(){
            var wrapperWidth = angular.element(document.querySelectorAll('.artTemplateWrapper.'+$scope.storeFrontOptions.artTemplate))[0].clientWidth;
            $scope.storeFrontOptions.artTemplateWrapperStyle = { height:wrapperWidth+'px' };
        },
        safeToAddToCart = function(){
            syncFactoryWithScope();
            var sizeSet = ( storeFrontOrderOptions.itemHeightIN !== 0 && storeFrontOrderOptions.itemWidthIN !== 0 ) ? 1 : 0,
                imageSet = ( storeFrontOrderOptions.itemSides === '1' && storeFrontOrderOptions.previewSrc !== '' ) || ( storeFrontOrderOptions.itemSides === '2s' && storeFrontOrderOptions.previewSrc !== '' && storeFrontOrderOptions.previewSrcTwo !== '' ) || ( storeFrontOrderOptions.itemSides === '2d' && storeFrontOrderOptions.previewSrc !== '' && storeFrontOrderOptions.previewSrcTwo !== '' ) || $scope.storeFrontOptions.itemArtSource === 'none' || ($scope.storeFrontOptions.itemArtSource === 'request' && $scope.storeFrontOptions.artRequestEmail ) ? 1 : 0,
                materialSet = ( storeFrontOrderOptions.selectedMaterial !== 0 ) ? 1 : 0;
                $scope.storeFrontOptions.orderReady = ( sizeSet && imageSet && materialSet ) ? 1 : 0;
        },
        init = function(){
            manageAlerts.clearAlerts();
            
            /* SET DEFAULT SCOPE VARS */
            $scope.storeFrontOptions = {};
            $scope.progressBar = { show:0, progress:0, uploadComplete:0, fileName:'' };
            $scope.storeFrontOptions.emailRegEx = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
            $scope.storeFrontOptions.activeNavTab = 'artwork';
            
            storeFrontOrderOptions.getClientID().
                success(function(data) {
                    storeFrontOrderOptions.clientID = data;
                    $scope.storeFrontOptions.clientID = storeFrontOrderOptions.clientID;
                }).
                error(function() {
                    $scope.storeFrontOptions.clientID = storeFrontOrderOptions.clientID;
                });
            
            $scope.storeFrontOptions.itemArtSource = storeFrontOrderOptions.itemArtSource;
            $scope.storeFrontOptions.artRequestEmail = storeFrontOrderOptions.artRequestEmail;
            $scope.storeFrontOptions.artSizeSet = ( storeFrontOrderOptions.itemWidthIN === 0 && storeFrontOrderOptions.itemHeightIN === 0 ) || storeFrontOrderOptions.selectedMaterial === 0 ? 0 : 1;
            $scope.storeFrontOptions.navTemplate = storeFrontOrderOptions.navTemplate;
            $scope.storeFrontOptions.artTemplate = (storeFrontOrderOptions.itemSides === '1') ? 'singleShow' : 'doubleShow';
            $scope.storeFrontOptions.doubleSidedUniqueArt = ( storeFrontOrderOptions.itemSides === '2d' ) ? 1 : 0;
            $scope.storeFrontOptions.orderReady = 0;
            $scope.storeFrontOptions.previewSrc = storeFrontOrderOptions.previewSrc;
            $scope.storeFrontOptions.previewSrcTwo = storeFrontOrderOptions.previewSrcTwo;
            
            /* CHECK IF ADD TO CART SHOULD BE ACTIVE */
            safeToAddToCart();
            
            /* IF ARTWORK TAB DISABLED SEND TO MATERIALS */
            if( !$scope.storeFrontOptions.artSizeSet ){
                $location.path( '/storeFront-Materials' );
            }
            
            var w = angular.element($window);
            w.bind('resize', function () {
                setArtWrapper();
                $scope.$apply();
            });
            setArtWrapper();
            $scope.storeFrontOptions.artTemplateStyle = { width:storeFrontOrderOptions.templateWidth, height:storeFrontOrderOptions.templateHeight, border:'1px solid black' };
            
            $scope.addOrderToCart = function(){
                //status, headers, config
                storeFrontOrderOptions.sendOrder().
                    success(function() {
                        storeFrontOrderOptions.cleanOrder();
                        $location.path( '/storeFront-Cart' );
                    });
            };
            $scope.artSourceUpdated = function(){
                safeToAddToCart();
            };
            
            var uploaderLoopFunc = function( file, previewSrc, printSrc ){
                Upload.upload({
                    url: 'scripts/php/storeFront/artUpload.php',
                    headers: {'Content-Type': file.type},
                    data: file,
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.progressBar.show = 1;
                    $scope.progressBar.uploadComplete = 0;
                    $scope.progressBar.fileName = evt.config.file.name;
                    $scope.progressBar.progress = progressPercentage;
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data) {
                    //console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
                    $scope.progressBar.show = 0;
                    $scope.progressBar.uploadComplete = 1;
                    $scope.progressBar.progress = 0;
                    
                    $scope.storeFrontOptions[previewSrc] = data.preview;
                    storeFrontOrderOptions[previewSrc] = data.preview;
                    storeFrontOrderOptions[printSrc] = data.print;
                    if( $scope.storeFrontOptions.artTemplate === 'doubleShow' && !$scope.storeFrontOptions.doubleSidedUniqueArt ){
                        $scope.storeFrontOptions.previewSrcTwo = data.preview;
                        storeFrontOrderOptions.previewSrcTwo = data.preview;
                        
                        storeFrontOrderOptions.printSrcTwo = data.print;
                    }
                    /* CHECK IF ADD TO CART SHOULD BE ACTIVE */
                    safeToAddToCart();
                });
            };
            $scope.upload = function ( files, previewSrc, printSrc ) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        uploaderLoopFunc( file, previewSrc, printSrc );
                    }
                }
            };
        };
    init();
});
