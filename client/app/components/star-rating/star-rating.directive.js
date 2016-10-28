(function() {
  angular
    .module('video-portal')
    .directive('starRating', starRating);

  function starRating() {
    var directive = {
      restrict: 'EA',
      templateUrl: '../../app/components/star-rating/star-rating.html',
      controller: starRatingController,
      scope: {
        ratings: '='
      },
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  }

  starRatingController.$inject = [];

  function starRatingController() {

    var vm = this;
    vm.average = getAverage(vm.ratings);
    
    function getAverage(array) {
      return Math.round((array.reduce((a,b) => {return a +b}))/array.length);
    }
    function generateStarsArray() {
      var average = getAverage(vm.ratings);
      vm.stars = [];
      var filled;
      for (var i = 5; i >= 0; i--) {
        filled = i <= average ? true : false;
        vm.stars.unshift({filled:  filled})
      }
    }
    generateStarsArray();
  }
}());
