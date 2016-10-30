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
        video: '=',
        readOnly: '='
      },
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  }

  starRatingController.$inject = ['StartRating', 'sessionFactory'];

  function starRatingController(StartRating, sessionFactory) {

    var vm = this,
        savingInProgress = false;
    vm.stars = [];
    vm.selectRating = selectRating;
    
    function getAverage(array) {
      return Math.round((array.reduce((a,b) => {return a +b}))/array.length);
    }

    function fillStars(rating, readOnly) {
      for (var i = 4; i >= 0; i--) {
        vm.stars[i] = {
          filled: i <= rating - 1 && readOnly,
          rating: i + 1
        };
      }
    }

    function generateStarsArray() {
      var average = getAverage(vm.video.ratings);
      fillStars(average, vm.readOnly); 
    }

    function selectRating(rating) {
      if (!vm.readOnly) {
        var response = sessionFactory.getSessionId();
        if (typeof response == 'string') {
          saveRate(rating, response);
        } else {
          if (!savingInProgress) {
            savingInProgress = true;
            response
              .then( response => {
                var user = {sessionId: response.sessionId}
                sessionFactory.setCurrentUser(user);
                saveRate(rating, response.sessionId);
              })
              .catch( error => {
                console.log(error);
                savingInProgress = false;
              });
          }
        }
      }
    }

    function saveRate(rating, sessionId) {
      var data = {
          videoId: vm.video._id,
          rating: rating
        } 
      StartRating.save({sessionId: sessionId}, data).$promise
        .then( response => {
          vm.readOnly = true;
          fillStars(rating, vm.readOnly);
          savingInProgress = false;
        })
        .catch( error => {
          console.log(error);
          savingInProgress = false;
        });
    }

    generateStarsArray();
  }
}());
