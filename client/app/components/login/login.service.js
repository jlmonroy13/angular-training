(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('Login', Login)

    Login.$inject = ['$resource'];

    function Login($resource) {
      return $resource("/user/auth");
    }
})();
