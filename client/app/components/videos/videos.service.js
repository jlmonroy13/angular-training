(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('videosService', videosService)

    videosService.$inject = ['$http', '$localStorage', 'sessionFactory'];

    function videosService($http, $localStorage, sessionFactory) {
      var factory = {
        getVideos,
        setSelectedVideo,
        getSelectedVideo
      }

      var   videos = [],
            skip   = 0;
      const LIMIT  = 10;

      function fetchVideos(sessionId) {
        var req = {
          method: 'GET',
          url: `/videos?sessionId=${sessionId}`,
          params: {
            skip: skip,
            limit: LIMIT
          }
        }
        // when promise is resolve skip is incremented to fetch the next ten videos in the next request and save videos in a local variable
        var promise = $http(req);
          promise
          .then( response => {
            videos = videos.concat(response.data.data);
            skip += LIMIT;
          })
          .catch( error => {
            console.log(error);
          });
        return promise
      }

      // return videos from API if there are no videos uploaded or getMoeVideos flag is set as true
      function getVideos(getMoreVideos) {
        if (videos.length != 0 && !getMoreVideos) return videos; 
        var response = sessionFactory.getSessionId();
        if (typeof response == 'string') {
          return fetchVideos(response);
        } else {
          return response
            .then( response => {
              var user = {sessionId: response.data.sessionId}
              sessionFactory.setCurrentUser(user);
              return fetchVideos(response.data.sessionId);
            })
            .catch( error => {
              console.log(error);
            });
        }
      }

      // save the selected video in local storage
      function setSelectedVideo(video) {
        $localStorage.selectedVideo = video;
      }

      // get selected video from local storage
      function getSelectedVideo() {
        return $localStorage.selectedVideo;
      }

      return factory;
    }
})();
