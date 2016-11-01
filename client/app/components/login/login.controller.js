(function() {
  angular
    .module('video-portal')
    .controller('loginController', loginController);

    loginController.$inject = ['Login', '$location', 'sessionFactory', '$localStorage'];

    function loginController(Login, $location, sessionFactory, $localStorage) {

      var vm = this;
      vm.authenticateUser = authenticateUser;
      vm.setCurrentUser = setCurrentUser;

      // Redirect to videos page is a user is logged
      if ($localStorage.user) $location.path('dashboard/videos');
      

      function authenticateUser() {
        // data is the info got it from the login form
        var data = {
          username: vm.username,
          password: CryptoJS.MD5(vm.password).toString(CryptoJS.enc.Base64)
        }
        // Login.save is a factory method that fetch the sessionId to authenticate user
        Login.save(data)
          .then( response => {
            if (response.data.sessionId) {
              // If username and password are correct data is save in local storage and user is redirect to videos page
              vm.sessionId = response.data.sessionId;
              $localStorage.user = data;
              vm.setCurrentUser(response.data.sessionId);
              $location.path('dashboard/videos');
            } else {
              // If username or password is invalid the response is an error message that is display in the view 
              vm.errorMessage = response.data.error;
            }
          })
          .catch( response => {
            // If username or password is missing the response is an error message that is display in the view 
            vm.errorMessage = response.data.error;
          });
      }

      // setCurrentUser calls a method of sessionFactory that save the username and sessionId
      function setCurrentUser(sessionId) {
        var user = {
          sessionId: sessionId,
          username: vm.username
        }
        sessionFactory.setCurrentUser(user);
      }
    }
})(); 
