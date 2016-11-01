(function() {
  angular
    .module('video-portal')
    .controller('videosController', videosController);

    videosController.$inject = ['sessionFactory', '$location', '$localStorage', 'videosService', 'Login'];

    function videosController(sessionFactory, $location, $localStorage, videosService, Login) {

      var vm = this,
          fetchingInProgress = false;
      vm.videos = [];
      vm.getVideos = getVideos;

      activate();

      // get the videos to be display in the view making a request to videos service, this function is also use to load more videos when user scrolls down
      function getVideos(getMoreVideos) {
        if (!fetchingInProgress) {
          fetchingInProgress = true;
          var response = videosService.getVideos(getMoreVideos);
          if (Array.isArray(response)) {
            vm.videos = response;
            fetchingInProgress = false;
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
      }

      // this function is executed when the controller init and call getVideos
      function activate() {
        getVideos(false);
      }
    }
    
})(); 
