angular.module('video-portal', ['ui.router', 'ngResource', 'ngStorage', 'ngAnimate', 'infinite-scroll']);

(function() {
  angular
    .module('video-portal')
    .config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider'];

    function router($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('login', {
          url: '/',
          templateUrl: 'app/components/login/login.html',
          controller: 'loginController',
          controllerAs: 'loginCtrl',
        })
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'app/components/dashboard/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'dashboardCtrl',
        }) 
        .state('videos', {
          url: '/videos',
          templateUrl: 'app/components/videos/videos.html',
          controller: 'videosController',
          controllerAs: 'videosCtrl',
          parent: 'dashboard'
        })  
        .state('video-detail', {
          url: '/video-detail',
          templateUrl: 'app/components/video-detail/video-detail.html',
          controller: 'videoDetailController',
          controllerAs: 'videoDetailCtrl',
          parent: 'dashboard',
        }) 
    }
})();

(function() {
  angular
    .module('video-portal')
    .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['$location', '$localStorage', '$state'];

    function dashboardController($location, $localStorage, $state) {

      var vm = this;

      if ($localStorage.user) {
        $location.path('/dashboard/videos');
      } else {
        $location.path('/');
      }
      
    }
})(); 

(function() {
  angular
    .module('video-portal')
    .controller('loginController', loginController);

    loginController.$inject = ['Login', '$location', 'sessionFactory', '$localStorage'];

    function loginController(Login, $location, sessionFactory, $localStorage) {

      var vm = this;
      vm.authenticateUser = authenticateUser;
      if ($localStorage.user) $location.path('dashboard');

      function authenticateUser() {
        var data = {
          username: vm.username,
          password: CryptoJS.MD5(vm.password).toString(CryptoJS.enc.Base64)
        }
        Login.save(data).$promise
          .then( response => {
            if (response.sessionId) {
              $localStorage.user = data;
              var user = {
                sessionId: response.sessionId,
                username: vm.username
              }
              sessionFactory.setCurrentUser(user);
              $location.path('dashboard/videos');
            } else {
              vm.errorMessage = response.error;
            }
          })
          .catch( response => {
            vm.errorMessage = response.data.error;
          });
      }
    }
})(); 

(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('Login', Login)

    Login.$inject = ['$resource'];

    function Login($resource) {
      return $resource("/user/auth");
    }
})();

(function() {
  angular
    .module('video-portal')
    .directive('mainHeader', mainHeader);

  function mainHeader() {
    var directive = {
      restrict: 'EA',
      templateUrl: '../../app/components/main-header/main-header.html',
      controller: mainHeaderController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

  }

  mainHeaderController.$inject = ['sessionFactory', '$localStorage', '$location'];

  function mainHeaderController(sessionFactory, $localStorage, $location) {

    var vm = this;
    vm.user = $localStorage.user;
    vm.logout = sessionFactory.logout;
    vm.goVideos = goVideos;

    function goVideos() {
      $location.path('/dashboard/videos');
    }

  }

}());

(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('sessionFactory', sessionFactory)

    sessionFactory.$inject = ['$location', '$localStorage', 'Login'];

    function sessionFactory($location, $localStorage, Login) {

      var currentUser;

      var factory = {
        getSessionId,
        logout,
        setCurrentUser
      }

      function setCurrentUser(user) {
        currentUser = user;
      }

      function logout() {
        $localStorage.user = null;
        $location.path('/');
        currentUser = null;
      }

      function getSessionId() {
        var sessionId;
        if (currentUser) {
          return  currentUser.sessionId;
        } else {
          var data = {
            username: $localStorage.user.username,
            password: $localStorage.user.password
          } 
          return Login.save(data).$promise
        }
      }

      return factory;
    }
})();

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

    function selectVideo(video) {
      videosService.setSelectedVideo(video);
      $rootScope.$emit('selectVideo');
      $location.path('/dashboard/video-detail');
    }
  }
}());

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

(function() {
  angular
    .module('video-portal')
    .controller('videosController', videosController);

    videosController.$inject = ['sessionFactory', '$location', '$localStorage', 'videosService', 'Login'];

    function videosController(sessionFactory, $location, $localStorage, videosService, Login) {

      var vm = this,
          fetchingInProgress = false;
      vm.videos = [];
      vm.getMoreVideos = getMoreVideos;

      if ($localStorage.user) {
        activate();
      } else {
        $location.path('/');
      } 

      function getMoreVideos(){
        getSessionId(true);
      }

      function getSessionId(getMoreVideos) {
        var response = sessionFactory.getSessionId();
        if (typeof response == 'string') {
          getVideos(sessionFactory.getSessionId());
        } else {
          if (!fetchingInProgress) {
            fetchingInProgress = true;
            response
              .then( response => {
                var user = {sessionId: response.sessionId}
                sessionFactory.setCurrentUser(user);
                getVideos(response.sessionId, getMoreVideos);
              })
              .catch( error => {
                console.log(error);
                fetchingInProgress = false;
              });
          }
        }
      }

      function getVideos(sessionId, getMoreVideos) {
        var response = videosService.getVideos(sessionId, getMoreVideos);
        if (Array.isArray(response)) {
          vm.videos = response;
        } else {
          response
            .then(response => {
              vm.videos = vm.videos.concat(response.data.data);
              fetchingInProgress = false;
            })
            .catch( error => {
              console.log(error);
              fetchingInProgress = false;
            });
        }
      }

      function activate() {
        getSessionId(false);
      }
    }
    
})(); 

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

(function () {
  angular
    .module('video-portal')
    .filter('characters', function () {
      return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            input = input.substring(0, chars);
          if (!breakOnWord) {
            var lastspace = input.lastIndexOf(' ');
            if (lastspace !== -1) {
              input = input.substr(0, lastspace);
            }
          } else{
            while(input.charAt(input.length-1) === ' '){
              input = input.substr(0, input.length -1);
            }
          }
          return input + '…';
        }
        return input;
      };
    })
})();
