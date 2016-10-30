(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('StartRating', StartRating)

    StartRating.$inject = ['$resource'];

    function StartRating($resource) {
      return $resource("/video/ratings", {sessionId:'@sessionId'});
    }
})();
