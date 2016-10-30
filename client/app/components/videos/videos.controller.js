(function() {
  angular
    .module('video-portal')
    .controller('videosController', videosController);

    videosController.$inject = ['sessionFactory', '$location', '$localStorage', 'videosService', 'Login'];

    function videosController(sessionFactory, $location, $localStorage, videosService, Login) {

      var vm = this,
          fetchingInProgress = false;
      vm.videos = [];
      vm.getMoreVideos = getMoreVideos;

      if ($localStorage.user) {
        activate();
      } else {
        $location.path('/');
      } 

      function getMoreVideos(){
        getSessionId(true);
      }

      function getSessionId(getMoreVideos) {
        var response = sessionFactory.getSessionId();
        if (typeof response == 'string') {
          getVideos(sessionFactory.getSessionId());
        } else {
          if (!fetchingInProgress) {
            fetchingInProgress = true;
            response
              .then( response => {
                var user = {sessionId: response.sessionId}
                sessionFactory.setCurrentUser(user);
                getVideos(response.sessionId, getMoreVideos);
              })
              .catch( error => {
                console.log(error);
                fetchingInProgress = false;
              });
          }
        }
      }

      function getVideos(sessionId, getMoreVideos) {
        var response = videosService.getVideos(sessionId, getMoreVideos);
        if (Array.isArray(response)) {
          vm.videos = response;
        } else {
          response
            .then(response => {
              vm.videos = vm.videos.concat(response.data.data);
              fetchingInProgress = false;
            })
            .catch( error => {
              console.log(error);
              fetchingInProgress = false;
            });
        }
      }

      function activate() {
        getSessionId(false);
      }
    }
    
})(); 
