(function() {
  angular
    .module('video-portal')
    .controller('loginController', loginController);

    loginController.$inject = ['Login', '$location', 'sessionFactory', '$localStorage'];

    function loginController(Login, $location, sessionFactory, $localStorage) {

      var vm = this;
      vm.authenticateUser = authenticateUser;
      if ($localStorage.user) $location.path('dashboard');

      function authenticateUser() {
        var data = {
          username: vm.username,
          password: CryptoJS.MD5(vm.password).toString(CryptoJS.enc.Base64)
        }
        Login.save(data).$promise
          .then( response => {
            if (response.sessionId) {
              $localStorage.user = data;
              var user = {
                sessionId: response.sessionId,
                username: vm.username
              }
              sessionFactory.setCurrentUser(user);
              $location.path('dashboard/videos');
            } else {
              vm.errorMessage = response.error;
            }
          })
          .catch( response => {
            vm.errorMessage = response.data.error;
          });
      }
    }
})(); 
