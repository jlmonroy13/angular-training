describe('Main header directive', function() {
  var $compile, $rootScope, $httpBackend, $templateCache, element;

  beforeEach(module('video-portal'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _$templateCache_){
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $templateCache = _$templateCache_;
  }));

  beforeEach(function() {
    var template = `<header class="main-header">
                      <h1 class="main-header__logo" ng-click="vm.goVideos()">Video Portal</h1>
                      <div class="navbar">
                        <span class="navbar__text capitalize">{{vm.user.username}}</span><!-- 
                         --><span class="navbar__link" ng-click="vm.logout()">Logout</span>
                      </div>
                    </header>`;
    $templateCache.put('../../app/components/main-header/main-header.html', template);
    element = $compile("<main-header></main-header>")($rootScope);
  })

  it('sholud replaces the element with the appropriate content', function() {
    $httpBackend.expect('GET', 'app/components/login/login.html').respond(200);
    $rootScope.$digest();
    expect(element.html()).toContain("Video Portal");
  });
});
