(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('sessionFactory', sessionFactory)

    sessionFactory.$inject = ['$location', '$localStorage', 'Login'];

    function sessionFactory($location, $localStorage, Login) {

      var currentUser;

      var factory = {
        getSessionId,
        logout,
        setCurrentUser
      }

      function setCurrentUser(user) {
        currentUser = user;
      }

      function logout() {
        $localStorage.user = null;
        $location.path('/');
        currentUser = null;
      }

      function getSessionId() {
        var sessionId;
        if (currentUser) {
          return  currentUser.sessionId;
        } else {
          var data = {
            username: $localStorage.user.username,
            password: $localStorage.user.password
          } 
          return Login.save(data).$promise
        }
      }

      return factory;
    }
})();
