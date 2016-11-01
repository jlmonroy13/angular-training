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

      // Redirect to login page if no user is logged
      if (!$localStorage.user) $location.path('/');
      
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
      vm.setCurrentUser = setCurrentUser;

      // Redirect to videos page is a user is logged
      if ($localStorage.user) $location.path('dashboard/videos');
      

      function authenticateUser() {
        // data is the info got it from the login form
        var data = {
          username: vm.username,
          password: CryptoJS.MD5(vm.password).toString(CryptoJS.enc.Base64)
        }
        // Login.save is a factory method that fetch the sessionId to authenticate user
        Login.save(data)
          .then( response => {
            if (response.data.sessionId) {
              // If username and password are correct data is save in local storage and user is redirect to videos page
              vm.sessionId = response.data.sessionId;
              $localStorage.user = data;
              vm.setCurrentUser(response.data.sessionId);
              $location.path('dashboard/videos');
            } else {
              // If username or password is invalid the response is an error message that is display in the view 
              vm.errorMessage = response.data.error;
            }
          })
          .catch( response => {
            // If username or password is missing the response is an error message that is display in the view 
            vm.errorMessage = response.data.error;
          });
      }

      // setCurrentUser calls a method of sessionFactory that save the username and sessionId
      function setCurrentUser(sessionId) {
        var user = {
          sessionId: sessionId,
          username: vm.username
        }
        sessionFactory.setCurrentUser(user);
      }
    }
})(); 

(function() {
  angular
    .module('video-portal')
    .controller('videoDetailController', videoDetailController);

    videoDetailController.$inject = ['$location', '$localStorage', 'videosService', '$rootScope'];

    function videoDetailController($location, $localStorage, videosService, $rootScope) {

      var vm = this,
          fetchingInProgress = false;
      vm.videos = [];
      vm.getVideos = getVideos;

      activate();

      // get the selected video save in the videos services to display in the view
      function getSelectedVideo() {
        vm.video = videosService.getSelectedVideo();
      }

      // get video list to display in the sidebar
      function getVideos(getMoreVideos) {
        if (!fetchingInProgress) {
          fetchingInProgress = true;
          var response = videosService.getVideos(getMoreVideos);
          if (Array.isArray(response)) {
            vm.videos = response;
            fetchingInProgress = false;
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
      }

      // this function is executed when the controller init and call getVideos and getSelectedVideo
      function activate() {
        getVideos(false);
        getSelectedVideo();
      }

      // listen and event that indicates that a video was selected and execute the getSelectedVideo function
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
      vm.getVideos = getVideos;

      activate();

      // get the videos to be display in the view making a request to videos service, this function is also use to load more videos when user scrolls down
      function getVideos(getMoreVideos) {
        if (!fetchingInProgress) {
          fetchingInProgress = true;
          var response = videosService.getVideos(getMoreVideos);
          if (Array.isArray(response)) {
            vm.videos = response;
            fetchingInProgress = false;
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
      }

      // this function is executed when the controller init and call getVideos
      function activate() {
        getVideos(false);
      }
    }
    
})(); 

(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('Login', Login)

    Login.$inject = ['$http'];

    function Login($http) {
      var factory = {
        save
      }
      function save(data) {
        var req = {
          method: 'POST',
          url: '/user/auth',
          data: data // {username: "", password: ""}
        }
        return $http(req);
      }
      return factory;
    }
})();

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

      // setCurrentUser save the current user for future request
      function setCurrentUser(user) {
        currentUser = user;
      }

      // logout redirect user to login page and clean user info from factory and local storage
      function logout() {
        $localStorage.user = null;
        $location.path('/');
        currentUser = null;
      }

      // getsessionId return session id if this is save in the factory, if not make a request to the login service
      function getSessionId() {
        var sessionId;
        if (currentUser) {
          return  currentUser.sessionId;
        } else {
          var data = {
            username: $localStorage.user.username,
            password: $localStorage.user.password
          }
          return Login.save(data)
        }
      }

      return factory;
    }
})();

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

    // This function redirect user to videos page is "Video Portal" title is clicked
    function goVideos() {
      $location.path('/dashboard/videos');
    }

  }

}());

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

(function () {
  // this filter truncate text depending of numbers of chars selected
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
