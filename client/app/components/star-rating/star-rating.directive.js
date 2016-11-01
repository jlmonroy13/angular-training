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

    // getAverage calculate the overall rating base on video ratings    
    function getAverage(array) {
      return Math.round((array.reduce((a,b) => {return a +b}))/array.length);
    }

    // fillStarts fill starts with yellow color depending of average reting
    function fillStars(rating, readOnly) {
      for (var i = 4; i >= 0; i--) {
        vm.stars[i] = {
          filled: i <= rating - 1 && readOnly,
          rating: i + 1
        };
      }
    }

    // generateStarsArray generate the array to renders stars in the view
    function generateStarsArray() {
      var average = getAverage(vm.video.ratings);
      fillStars(average, vm.readOnly); 
    }

    // selectRating make a request to get the session id and with the response call the saveRating function
    function selectRating(rating) {
      if (!vm.readOnly) {
        var response = sessionFactory.getSessionId();
        if (typeof response == 'string') {
          saveRating(rating, response);
        } else {
          if (!savingInProgress) {
            savingInProgress = true;
            response
              .then( response => {
                var user = {sessionId: response.sessionId}
                sessionFactory.setCurrentUser(user);
                saveRating(rating, response.sessionId);
              })
              .catch( error => {
                console.log(error);
                savingInProgress = false;
              });
          }
        }
      }
    }

    // save the rating through a request to the StartRating service
    function saveRating(rating, sessionId) {
      var data = {
          videoId: vm.video._id,
          rating: rating
        } 
      StartRating.save({sessionId: sessionId}, data).$promise
        .then( response => {
          vm.readOnly = true;
          fillStars(rating, vm.readOnly);
          vm.video.ratings.push(rating);
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
