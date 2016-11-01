describe('Video card directive', function() {
  var $compile, $rootScope, $httpBackend, $templateCache, element;

  beforeEach(module('video-portal'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _$templateCache_){
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $templateCache = _$templateCache_;
  }));

  beforeEach(function() {
    var template = `<div class="video-card">
                      <h2 class="video-card__title" ng-click="vm.selectVideo(vm.video)">{{vm.video.name}}</h2>
                      <video class="video-card__player" ng-src="{{vm.video.url}}" controls></video>
                      <star-rating video="vm.video" read-only="true"></star-rating>
                      <p class="video-card__description">{{vm.video.description | characters: 200: false}}</p>
                    </div>`;
    $templateCache.put('../../app/components/video-card/video-card.html', template);
    element = $compile("<video-card></video-card>")($rootScope);
  })

  it('should replaces the element with the appropriate content', function() {
    $httpBackend.expect('GET', '../../app/components/star-rating/star-rating.html').respond(200);
    $httpBackend.expect('GET', 'app/components/login/login.html').respond(200);
    $rootScope.$digest();
    expect(element.html()).toContain("video-card__title");
  });
});
