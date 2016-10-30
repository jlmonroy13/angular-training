(function() {
  angular
    .module('video-portal')
    .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$location', '$localStorage', '$state'];

    function dashboardController($location, $localStorage, $state) {

      var vm = this;

      if ($localStorage.user) {
        $location.path('/dashboard/videos');
      } else {
        $location.path('/');
      }
      
    }
})(); 
