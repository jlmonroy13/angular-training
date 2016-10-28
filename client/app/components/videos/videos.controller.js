(function() {
  angular
    .module('video-portal')
    .controller('videosController', videosController);

    videosController.$inject = ['sessionFactory', '$location', '$localStorage', 'Videos', 'Login'];

    function videosController(sessionFactory, $location, $localStorage, Videos, Login) {

      if ($localStorage.user) {
        activate();
      } else {
        $location.path('/');
      } 

      var vm = this;

      vm.videos = [];

      function getSessionId() {
        var sessionId;
        if (sessionFactory.getCurrentUser()) {
          sessionId = sessionFactory.getCurrentUser().sessionId;
          fetchVideos(sessionId);
        } 
        var data = {
          username: $localStorage.user.username,
          password: $localStorage.user.password
        }
        Login.save(data).$promise
          .then( response => {
            sessionId = response.sessionId;
            fetchVideos(sessionId);
          })
          .catch( response => {
            vm.errorMessage = response.data.error;
          });
      }

      function fetchVideos(sessionId) {
        Videos.get({sessionId: sessionId}).$promise
          .then(response => {
            vm.videos = response.data;
          })
          .catch( error => {
            console.log(error);
          });
      }

      function activate() {
        getSessionId();
      }
    }
    
})(); 
