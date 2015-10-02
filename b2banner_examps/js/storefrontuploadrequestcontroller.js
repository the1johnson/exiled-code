'use strict';

/**
 * @ngdoc function
 * @name storeFrontUploadRequestApp.controller:StoreFrontUploadRequestController
 * @description
 * # StoreFrontUploadRequestController
 * Controller of the storeFrontUploadRequestApp
 */
angular.module('storeFrontUploadRequestApp')
.controller('StoreFrontUploadRequestController', function ($scope, $window, $routeParams, $timeout, $location, Upload, storeFrontUploadRequestOptions) {
    var w = angular.element($window),
        setArtWrapper = function(){
            var wrapperWidth = angular.element( document.querySelectorAll('.artTemplateWrapper.'+$scope.storeFrontOptions.artTemplate) )[0].clientWidth;
            $scope.storeFrontOptions.artTemplateWrapperStyle = { height:wrapperWidth+'px' };
        },
        displayArtTemplate = function(){
            var widthInchesToPixels = parseInt(storeFrontUploadRequestOptions.orderItem.width)*72,
                heightInchesToPixels = parseInt(storeFrontUploadRequestOptions.orderItem.height)*72,
                resizeRatio = ( widthInchesToPixels > heightInchesToPixels ) ? widthInchesToPixels/heightInchesToPixels : heightInchesToPixels/widthInchesToPixels,
                displayWidth = (widthInchesToPixels >= heightInchesToPixels) ? '90%' : (90/resizeRatio)+'%',
                displayHeight = (heightInchesToPixels >= widthInchesToPixels) ? '90%' : (90/resizeRatio)+'%';
                
            $scope.storeFrontOptions.artTemplateStyle = { width:displayWidth, height:displayHeight, border:'1px solid black' };
        },
        safeToUpdate = function(){
            var imgSet = ( $scope.storeFrontOptions.artTemplate === 'singleShow' && $scope.storeFrontOptions.previewSrc !== '' ) || ( $scope.storeFrontOptions.artTemplate === 'doubleShow' && $scope.storeFrontOptions.previewSrc !== '' && $scope.storeFrontOptions.previewSrcTwo !== '' ) ? 1 : 0;
            
            $scope.storeFrontOptions.orderReady = (imgSet) ? 1 : 0;
        },
        uploaderLoopFunc = function( file, previewSrc, printSrc ){
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
                storeFrontUploadRequestOptions[previewSrc] = data.preview;
                storeFrontUploadRequestOptions[printSrc] = data.print;
                
                if( $scope.storeFrontOptions.artTemplate === 'doubleShow' && !$scope.storeFrontOptions.doubleSidedUniqueArt ){
                    $scope.storeFrontOptions.previewSrcTwo = data.preview;
                    storeFrontUploadRequestOptions.previewSrcTwo = data.preview;
                    
                    storeFrontUploadRequestOptions.printSrcTwo = data.print;
                }
                /* CHECK IF ADD TO CART SHOULD BE ACTIVE */
                safeToUpdate();
            });
        },
        init = function(){
            /* SET DEFAULT SCOPE VARS */
            $scope.storeFrontOptions = {};
            $scope.progressBar = { show:0, progress:0, uploadComplete:0, fileName:'' };
            $scope.storeFrontOptions.orderReady = 0;
            $scope.storeFrontOptions.loggedIn = 0;
            $scope.storeFrontOptions.itemID = $routeParams.id;
            $scope.storeFrontOptions.orderNumber = $scope.storeFrontOptions.itemID.substring( 0, $scope.storeFrontOptions.itemID.length-2 );
            $scope.storeFrontOptions.itemArtSource = 'upload';
            $scope.storeFrontOptions.artStatus = 'loading';
            
            /* CHECK IF USER IS LOGGED IN */
            storeFrontUploadRequestOptions.checkLoggedState().
                success(function(data) {
                    $scope.storeFrontOptions.loggedIn = data.loggedInStatus;
                });
            
            /* GET CLIENT ID FOR ART PATHING */
            storeFrontUploadRequestOptions.getClientID().
                success(function(data) {
                    storeFrontUploadRequestOptions.clientID = data;
                    $scope.storeFrontOptions.clientID = storeFrontUploadRequestOptions.clientID;
                }).
                error(function() {
                    $scope.storeFrontOptions.clientID = storeFrontUploadRequestOptions.clientID;
                });
            
            /* GET ORDER ITEM DATA AND SET UP ART TEMPLATE PREVIEW */
            storeFrontUploadRequestOptions.getItemData( $scope.storeFrontOptions.itemID ).
                success(function(data) {
                    storeFrontUploadRequestOptions.orderItem = data;
                    $scope.storeFrontOptions.artStatus = storeFrontUploadRequestOptions.orderItem.itemStatus;
                    $scope.storeFrontOptions.artTemplate = ( storeFrontUploadRequestOptions.orderItem.printSides === '1' ) ? 'singleShow' : 'doubleShow';
                    $scope.storeFrontOptions.doubleSidedUniqueArt = ( storeFrontUploadRequestOptions.orderItem.artSides === 'same' ) ? 0 : 1;
                    $timeout(function(){
                        setArtWrapper();
                    }, 30);
                    setArtWrapper();
                    displayArtTemplate();
                });
        };
        
    w.bind('resize', function () {
        setArtWrapper();
        $scope.$apply();
    });
    
    $scope.upload = function ( files, previewSrc, printSrc ) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                uploaderLoopFunc( file, previewSrc, printSrc );
            }
        }
    };
    
    $scope.updateArtModal = function(){
        $('#updateModal').modal();
    };
    
    $scope.updateArt = function(){
        storeFrontUploadRequestOptions.updateItemArt().
            success(function() {
                $('#updateModal').on('hidden.bs.modal', function (){
                    $scope.$apply(function(){
                        var redirPath = ( $scope.storeFrontOptions.loggedIn ) ? '/admin-order/'+$scope.storeFrontOptions.orderNumber : '/storeFront-Materials';
                        $location.path( redirPath );
                    });
                });
                $('#updateModal').modal('hide');
            });
    };
    
    init();
});
