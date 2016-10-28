(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('Videos', Videos)

    Videos.$inject = ['$resource'];

    function Videos($resource) {
      return $resource("/videos");
    }
})();
