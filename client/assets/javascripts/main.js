angular.module('video-portal', ['ui.router', 'ngResource', 'ngStorage']);

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
          controllerAs: 'loginCtrl'
        })
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'app/components/dashboard/dashboard.html',
          controller: 'dashboardController',
          controllerAs: 'dashboardCtrl'
        }) 
        .state('videos', {
          url: '/videos',
          templateUrl: 'app/components/videos/videos.html',
          controller: 'videosController',
          controllerAs: 'videosCtrl',
          parent: 'dashboard'
        }) 
    }
})();

(function() {
  angular
    .module('video-portal')
    .controller('dashboardController', dashboardController);

    dashboardController.$inject = ['sessionFactory', '$location', '$localStorage', 'Videos', 'Login'];

    function dashboardController(sessionFactory, $location, $localStorage, Videos, Login) {

      if ($localStorage.user) {
        activate();
      } else {
        $location.path('/');
      } 

      var vm = this;
      vm.videos = [];

      function getSessionId() {
        var sessionId;
        if (sessionFactory.getCurrentUser()) {
          sessionId = sessionFactory.getCurrentUser().sessionId;
          fetchVideos(sessionId);
        } 
        var data = {
          username: $localStorage.user.username,
          password: $localStorage.user.password
        }
        Login.save(data).$promise
          .then( response => {
            sessionId = response.sessionId;
            fetchVideos(sessionId);
          })
          .catch( response => {
            vm.errorMessage = response.data.error;
          });
      }

      function fetchVideos(sessionId) {
        Videos.get({sessionId: sessionId}).$promise
          .then(response => {
            vm.videos = response.data;
          })
          .catch( error => {
            console.log(error);
          });
      }

      function activate() {
        getSessionId();
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
              $location.path('dashboard');
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

  }

}());

(function () {  
  'user strict'
  angular
    .module('video-portal')
    .factory('sessionFactory', sessionFactory)

    sessionFactory.$inject = ['$location', '$localStorage'];

    function sessionFactory($location, $localStorage) {

      var currentUser;

      var factory = {
        getCurrentUser,
        logout,
        setCurrentUser
      }

      function setCurrentUser(user) {
        currentUser = user;
      }

      function getCurrentUser() {
        return currentUser;
      }

      function logout() {
        $localStorage.user = null;
        $location.path('/');
        currentUser = null;
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

(function() {
  angular
    .module('video-portal')
    .controller('videosController', videosController);

    videosController.$inject = ['sessionFactory', '$location', '$localStorage', 'Videos', 'Login'];

    function videosController(sessionFactory, $location, $localStorage, Videos, Login) {

      if ($localStorage.user) {
        activate();
      } else {
        $location.path('/');
      } 

      var vm = this;

      vm.videos = [];

      function getSessionId() {
        var sessionId;
        if (sessionFactory.getCurrentUser()) {
          sessionId = sessionFactory.getCurrentUser().sessionId;
          fetchVideos(sessionId);
        } 
        var data = {
          username: $localStorage.user.username,
          password: $localStorage.user.password
        }
        Login.save(data).$promise
          .then( response => {
            sessionId = response.sessionId;
            fetchVideos(sessionId);
          })
          .catch( response => {
            vm.errorMessage = response.data.error;
          });
      }

      function fetchVideos(sessionId) {
        Videos.get({sessionId: sessionId}).$promise
          .then(response => {
            vm.videos = response.data;
          })
          .catch( error => {
            console.log(error);
          });
      }

      function activate() {
        getSessionId();
      }
    }
    
})(); 

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
