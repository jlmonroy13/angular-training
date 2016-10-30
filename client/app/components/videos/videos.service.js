(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('videosService', videosService)

    videosService.$inject = ['$http', '$localStorage'];

    function videosService($http, $localStorage) {
      var factory = {
        getVideos,
        setSelectedVideo,
        getSelectedVideo
      }

      var videos = [],
          skip   = 0,
          limit  = 10;

      function fetchVideos(sessionId) {
        var req = {
          method: 'GET',
          url: `/videos?sessionId=${sessionId}`,
          params: {
            skip: skip,
            limit: limit
          }
        }
        var promise = $http(req);
        promise
          .then( response => {
            videos = videos.concat(response.data.data);
            skip += limit;
          })
          .catch( error => {
            console.log(error);
          });
        return promise
      }

      function getVideos(sessionId, getMoreVideos) {
        if (!videos.length || getMoreVideos) return fetchVideos(sessionId);
        return videos;
      }

      function setSelectedVideo(video) {
        $localStorage.selectedVideo = video;
      }

      function getSelectedVideo() {
        return $localStorage.selectedVideo;
      }

      return factory;
    }
})();
