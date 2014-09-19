pokemonTabletopApp.service('characterService', function($http, $location){
    this.newCharacter = function(_charType){
        if(_charType === 'ptu'){
             $http.post('./app/scripts/characterService.php',{'data':{'call_status':'new_sheet', 'sheet_table':'character_sheet'}}).
                success(function(data, status){
                    $location.path('/ptu-sheet/'+data);
                }).
                error(function(data, status){
                });
        }
    }
});

pokemonTabletopApp.service('loggedService', function($http, $location){
    
    this.logged = function(){
        $http.get('./app/scripts/loggedCheck.php').success(function(data, status, headers, config){
            if(!data){
                $location.path('/login');
            }
        });
    };
    
});