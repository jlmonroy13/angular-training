(function() {
  angular
    .module('video-portal')
    .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$location', '$localStorage', '$state'];

    function dashboardController($location, $localStorage, $state) {

      var vm = this;

      // Redirect to login page if no user is logged
      if (!$localStorage.user) $location.path('/');
      
    }
})(); 
