var controllers = {};

controllers.LandingController = function($scope){
    
}

controllers.LoginController = function($scope, $timeout, $location, $http){
    $scope.login_script_url = './app/scripts/login.php';
    $scope.loginFormInfo = {};
    $scope.validUpdate = function(){
        var errors = document.body.querySelectorAll('label.ng-binding:not(.ng-hide)'),
            allGroups = document.body.querySelectorAll('.has-error');
            
        for(i=0, k=allGroups.length; i<k; i++){
            angular.element(allGroups[i]).removeClass('has-error');
        }
        for(i=0, k=errors.length; i<k; i++){
            angular.element(errors[i]).parent().addClass('has-error');
        }
        if($scope.formErrors === 0){
            $scope.loginHandle();
        }
    }
    $scope.validateUserInfo = function(){
        $scope.usernameError = '';
        $scope.passwordError = '';
        $scope.formErrors = 0;
        
        if(!$scope.loginFormInfo.username){
            $scope.usernameError = ' – Required';
            $scope.formErrors++;
        }
        if(!$scope.loginFormInfo.password){
            $scope.passwordError = ' – Required';
            $scope.formErrors++;
        }
        $timeout($scope.validUpdate, 1);
    }
    $scope.loginHandle = function(){
        $scope.invalidLoginError = '';
        $http.post($scope.login_script_url,{'data':$scope.loginFormInfo}).
        success(function(data, status){
            $scope.login_status = status;
            $scope.login_data = data;
            $scope.login_result = data;
            if(data){
                $location.path('/dashboard');
            }else{
                angular.element(document.querySelector('#invalidLogin')).parent().addClass('has-error');
                $scope.invalidLoginError = 'Invalid Login';
            }
        }).
        error(function(data, status){
            $scope.registration_data = data ||"Request Failed";
            $scope.registration_status = status;
        });
    };
};

controllers.RegisterSuccessController = function($scope){
    
};

controllers.RegisterController = function($scope, $timeout, $location, $http){
    $scope.register_script_url = './app/scripts/register.php';
    $scope.user_check_url = './app/scripts/userCheck.php';
    $scope.registerFormInfo = {};
    
    $scope.validUpdate = function(){
        var errors = document.body.querySelectorAll('label.ng-binding:not(.ng-hide)'),
            allGroups = document.body.querySelectorAll('.has-error');
        
        for(i=0, k=allGroups.length; i<k; i++){
            angular.element(allGroups[i]).removeClass('has-error');
        }
        for(i=0, k=errors.length; i<k; i++){
            angular.element(errors[i]).parent().addClass('has-error');
        }
        if($scope.formErrors === 0){
            $scope.submitNewUser();
        }
    }
    
    $scope.checkUsername = function(){
        $http.post($scope.user_check_url,{'data':$scope.registerFormInfo}).
        success(function(data, status){
            $scope.user_check_status = status;
            $scope.user_check_data = data;
            $scope.user_check_result = data;
            $scope.user_exists = data;
            $scope.validateUserInfo();
        }).
        error(function(data, status){
            $scope.user_check_data = data ||"Request Failed";
            $scope.user_check_status = status;
        });
    }
    
    $scope.validateUserInfo = function(){
        $scope.usernameError = '';
        $scope.emailError = '';
        $scope.passwordError = '';
        $scope.passwordVerifyError = '';
        $scope.formErrors = 0;
        $scope.re = /\S+@\S+\.\S+/;
        
        if(!$scope.registerFormInfo.username){
            $scope.usernameError = ' – Required';
            $scope.formErrors++;
        }else if($scope.registerFormInfo.username.length < 5){
            $scope.usernameError = ' – Min Length: 5';
            $scope.formErrors++;
        }else if($scope.user_exists > 0){
            $scope.usernameError = ' – Username Taken';
            $scope.formErrors++;
        }
        
        if(!$scope.registerFormInfo.email){
            $scope.emailError = ' – Required';
            $scope.formErrors++;
        }else if(!$scope.re.test($scope.registerFormInfo.email)){
            $scope.emailError = ' – Use Valid Email';
            $scope.formErrors++;
        }
        
        if(!$scope.registerFormInfo.password){
            $scope.passwordError = ' – Required';
            $scope.formErrors++;
        }else if($scope.registerFormInfo.password.length < 5){
            $scope.passwordError = ' – Min Length: 5';
            $scope.formErrors++;
        }
        if($scope.registerFormInfo.passwordVerify !== $scope.registerFormInfo.password){
            $scope.passwordVerifyError = ' – Must Match';
            $scope.formErrors++;
        }
        $timeout($scope.validUpdate, 1);
    };
    
    $scope.submitNewUser = function(){
        $http.post($scope.register_script_url,{'data':$scope.registerFormInfo}).
        success(function(data, status){
            $scope.registration_status = status;
            $scope.registration_data = data;
            $scope.registration_result = data;
            $location.path('/register-success');
        }).
        error(function(data, status){
            $scope.registration_data = data ||"Request Failed";
            $scope.registration_status = status;
        });
    }
    
};

controllers.DashboardController = function($scope, $location, loggedService, characterService, $http){
    $scope.characterSheets = {};
    loggedService.logged();
    
     $http.post('./app/scripts/characterService.php',{'data':{'call_status':'character_sheet_check'}}).
        success(function(data, status){
            angular.forEach(data, function(val, key){
                if(val['charName'] == null || val['charName'] == ''){
                    $scope.characterSheets[key] = {'char_id':val['char_id'], "character_name":'Nameless Hero'};
                }else{
                    $scope.characterSheets[key] = {'char_id':val['char_id'], "character_name":val['charName']};
                }
            });
        }).
        error(function(data, status){
        });
    
    
    $scope.newPTUchar = function(){
        characterService.newCharacter('ptu');
    }
};

controllers.PtuSheetController = function($scope, $location, characterService, $http, $routeParams){
    $scope.formCharacterInfo = {};
    $scope.formPokemonInfo = {};
    init();
    
    function init(){
        //check if logged in and sheet belongs to user.
        $http.post('./app/scripts/characterService.php',{'data':{'call_status':'sheet_state', 'char_id':$routeParams.char_id}}).
        success(function(data, status){
            if(data){
                angular.element(document.querySelector('#sheet-buttons')).removeClass('hidden');
                $scope.ptuFormDisabled = false;
            }else{
                $scope.ptuFormDisabled = true;
            }
        }).
        error(function(data, status){
        });
        
        //fill in character data from db
        $http.post('./app/scripts/characterService.php',{'data':{'call_status':'read_char_sheet', 'char_id':$routeParams.char_id}}).
        success(function(data, status){
            
            angular.forEach(data, function(val, key){
                $scope.formCharacterInfo[key] = val;
            });
            
        }).
        error(function(data, status){
        });
        
        //fill in pokémon data from db
        $http.post('./app/scripts/characterService.php',{'data':{'call_status':'read_poke_sheet', 'char_id':$routeParams.char_id}}).
        success(function(data, status){
            $scope.formPokemonInfo = {};
            angular.forEach(data, function(val, key){
                $scope.formPokemonInfo[key] = val;
                $scope.activePokemon = 0;
            });
        }).
        error(function(data, status){
        });
    }
    
    $scope.updateActivePokemon = function(_newActive){
        $scope.activePokemon = _newActive;
    }
    
    $scope.saveSheet = function(){
        if(!$scope.ptuFormDisabled){
            
        }
    }
    
    $scope.newPokemonchar = function(){
        if(!$scope.ptuFormDisabled){
            
        }
    }
    
    $scope.linkCharPortrait = function(){
        if(!$scope.ptuFormDisabled){
            
        }
    }
    
    $scope.toDash = function(){
        $location.path('/dashboard');
    }
    
};

pokemonTabletopApp.controller(controllers);