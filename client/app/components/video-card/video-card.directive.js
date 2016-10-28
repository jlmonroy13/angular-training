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

  videoCardController.$inject = [];

  function videoCardController() {
    
  }
}());
