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

      // setCurrentUser save the current user for future request
      function setCurrentUser(user) {
        currentUser = user;
      }

      // logout redirect user to login page and clean user info from factory and local storage
      function logout() {
        $localStorage.user = null;
        $location.path('/');
        currentUser = null;
      }

      // getsessionId return session id if this is save in the factory, if not make a request to the login service
      function getSessionId() {
        var sessionId;
        if (currentUser) {
          return  currentUser.sessionId;
        } else {
          var data = {
            username: $localStorage.user.username,
            password: $localStorage.user.password
          }
          return Login.save(data)
        }
      }

      return factory;
    }
})();
