(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('Login', Login)

    Login.$inject = ['$http'];

    function Login($http) {
      var factory = {
        save
      }
      function save(data) {
        var req = {
          method: 'POST',
          url: '/user/auth',
          data: data // {username: "", password: ""}
        }
        return $http(req);
      }
      return factory;
    }
})();
