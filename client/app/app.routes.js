(function() {
  angular
    .module('video-portal')
    .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('login', {
          url: '/',
          templateUrl: 'app/components/login/login.html',
          controller: 'loginController',
          controllerAs: 'loginCtrl'
        })
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'app/components/dashboard/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'dashboardCtrl'
        }) 
        .state('videos', {
          url: '/videos',
          templateUrl: 'app/components/videos/videos.html',
          controller: 'videosController',
          controllerAs: 'videosCtrl',
          parent: 'dashboard'
        }) 
    }
})();
