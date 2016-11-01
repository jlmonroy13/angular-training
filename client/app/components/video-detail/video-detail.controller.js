(function() {
  angular
    .module('video-portal')
    .controller('videoDetailController', videoDetailController);

    videoDetailController.$inject = ['$location', '$localStorage', 'videosService', '$rootScope'];

    function videoDetailController($location, $localStorage, videosService, $rootScope) {

      var vm = this,
          fetchingInProgress = false;
      vm.videos = [];
      vm.getVideos = getVideos;

      activate();

      // get the selected video save in the videos services to display in the view
      function getSelectedVideo() {
        vm.video = videosService.getSelectedVideo();
      }

      // get video list to display in the sidebar
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

      // this function is executed when the controller init and call getVideos and getSelectedVideo
      function activate() {
        getVideos(false);
        getSelectedVideo();
      }

      // listen and event that indicates that a video was selected and execute the getSelectedVideo function
      $rootScope.$on('selectVideo', () => {
        getSelectedVideo();
      });

    }
})(); 
