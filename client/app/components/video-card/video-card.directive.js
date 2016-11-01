(function() {
  angular
    .module('video-portal')
    .directive('videoCard', videoCard);

  function videoCard() {
    var directive = {
      restrict: 'EA',
      templateUrl: '../../app/components/video-card/video-card.html',
      controller: videoCardController,
      scope: {
        video: '='
      },
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  }

  videoCardController.$inject = ['$location', 'videosService', '$rootScope'];

  function videoCardController($location, videosService, $rootScope) {

    var vm = this;
    vm.selectVideo = selectVideo;

    // Redirect to video-detail page a set the selected video through the videosService
    function selectVideo(video) {
      videosService.setSelectedVideo(video);
      $rootScope.$emit('selectVideo');
      $location.path('/dashboard/video-detail');
    }

  }
}());
