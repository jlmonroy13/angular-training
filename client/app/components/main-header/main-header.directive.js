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
