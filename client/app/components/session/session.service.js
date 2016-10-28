(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('sessionFactory', sessionFactory)

    sessionFactory.$inject = ['$location', '$localStorage'];

    function sessionFactory($location, $localStorage) {

      var currentUser;

      var factory = {
        getCurrentUser,
        logout,
        setCurrentUser
      }

      function setCurrentUser(user) {
        currentUser = user;
      }

      function getCurrentUser() {
        return currentUser;
      }

      function logout() {
        $localStorage.user = null;
        $location.path('/');
        currentUser = null;
      }

      return factory;
    }
})();
