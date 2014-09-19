var pokemonTabletopApp = angular.module('pokemonTabletopApp', ['ngRoute']);

pokemonTabletopApp.config(function($routeProvider){
    $routeProvider
        .when('/',
            {
                controller:'LandingController',
                templateUrl:'./app/partials/landing.html'
            })
        .when('/login',
            {
                controller:'LoginController',
                templateUrl:'./app/partials/login.html'
            })
        .when('/register',
            {
                controller:'RegisterController',
                templateUrl:'./app/partials/register.html'
            })
        .when('/register-success',
            {
                controller:'RegisterSuccessController',
                templateUrl:'./app/partials/register-success.html'
            })
        .when('/dashboard',
            {
                controller:'DashboardController',
                templateUrl:'./app/partials/dashboard.html'
            })
        .when('/ptu-sheet/:char_id',
            {
                controller:'PtuSheetController',
                templateUrl:'./app/partials/ptu-sheet.html'
            })
        .otherwise({redirectTo: '/'});
});