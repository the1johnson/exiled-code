'use strict';

/**
 * @ngdoc service
 * @name adminApp.adminMaterialsList
 * @description
 * # adminMaterialsList
 * Factory in the adminApp.
 */
angular.module('adminApp')
.factory('adminMaterialsList', ['$http', function($http){
    var factory = { callStatus:'none', data:null, materialList:[], categoryList:{All:''} };
    factory.normalizeData = function(){
        
        for( var i=0, k=factory.data.length; i<k; i++){
            /* SET MATERIAL RESTRICTIONS */
            factory.data[i].maxDimensionLG = ( factory.data[i].category === 'rigidsign' ) ? 96 : 0;
            factory.data[i].maxDimensionSM = ( factory.data[i].category === 'rigidsign' ) ? 48 : 0;
            factory.data[i].polePocketDisabled = ( factory.data[i].category === 'rigidsign' || factory.data[i].category === 'transit' ) ? 1 : 0;
            factory.data[i].bleedDisabled = ( factory.data[i].category !== 'billboard' || factory.data[i].category === 'transit' ) ? 1 : 0;
            factory.data[i].hemDisabled = ( factory.data[i].category === 'rigidsign' || factory.data[i].category === 'transit' ) ? 1 : 0;
            factory.data[i].grommetDisabled = ( factory.data[i].category === 'transit' ) ? 1 : 0;
            factory.data[i].packingDisabled = ( factory.data[i].category === 'rigidsign'  || factory.data[i].category === 'transit' ) ? 1 : 0;
            factory.data[i].webbingDisabled = ( factory.data[i].category === 'rigidsign'  || factory.data[i].category === 'transit' ) ? 1 : 0;
            factory.data[i].doubleSidedDisabled = ( factory.data[i].category === 'transit' || factory.data[i].substrate === 'vinyl_07' || factory.data[i].substrate === 'calendar_adhesive_lam' || factory.data[i].substrate === 'backlit_illumisol' ) ? 1 : 0;
            factory.data[i].hstakesDisabled = ( factory.data[i].substrate === 'coroplast_4' || factory.data[i].category !== 'transit' ) ? 0 : 1;
            factory.data[i].easelsDisabled = ( factory.data[i].substrate === 'coroplast_4_standee' || factory.data[i].substrate === 'paperboard_standee'  || factory.data[i].category !== 'transit' ) ? 0 : 1;
            
            /* MATERIALS GO INTO THE MAT LIST WITH ITS SET RESTRICTIONS THEN CREATE A CATEGORY TO USE AS A FILTER */
            factory.materialList.push( factory.data[i] );
            
            if( !factory.materialList.hasOwnProperty(factory.data[i].category) ){
                factory.categoryList[ factory.data[i].categoryDisplay ] = factory.data[i].category;
            }
            
        }
    };
    /* QUERY DATABASE FOR CLIENT MATERIALS */
    factory.setMaterialList = function(){
        return $http.get('scripts/php/storeFront/getMaterialsList.php');
    };
   
    return factory;
}]);
