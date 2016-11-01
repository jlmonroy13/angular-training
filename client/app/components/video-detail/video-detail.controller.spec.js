describe('Video detail controller', function () {

  var $controller, $rootScope, videoDetailCtrl, $httpBackend, videosService;

  beforeEach(module('video-portal'));

  beforeEach(inject(function(_$controller_, _$rootScope_,  _$httpBackend_, _videosService_){
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    videosService = _videosService_;
  }));

  beforeEach(function() {
    spyOn(videosService, 'getVideos').and.returnValue([
      {name: '[0] Getting Started With ReactJs'}
    ]);
    videoDetailCtrl = $controller('videoDetailController', {
      videosService: videosService
    });
  })

  describe('getVideos', function () {

    it('should get videos from videosServices when controller init', function () {
      expect(videosService.getVideos).toHaveBeenCalled();
    }); 

    it('should assign response value to videos variable after get videos from service', function() {
      expect(videoDetailCtrl.videos[0].name).toEqual('[0] Getting Started With ReactJs');
    });

  });

});
