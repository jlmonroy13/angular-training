(function() {
  angular
    .module('video-portal')
    .controller('videoDetailController', videoDetailController);

    videoDetailController.$inject = ['$location', '$localStorage', 'videosService', '$rootScope'];

    function videoDetailController($location, $localStorage, videosService, $rootScope) {

      var vm = this;
      vm.videos = [];

      if ($localStorage.user) {
        activate();
      } else {
        $location.path('/');
      }

      function getSelectedVideo() {
        vm.video = videosService.getSelectedVideo();
      }

      function activate() {
        vm.videos = videosService.getVideos();
        getSelectedVideo();
      }

      $rootScope.$on('selectVideo', () => {
        getSelectedVideo();
      });

    }
})(); 
