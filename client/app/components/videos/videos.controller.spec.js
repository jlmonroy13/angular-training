describe('Videos controller', function () {

  var $controller, $rootScope, videosCtrl, $httpBackend, videosService;

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
    videosCtrl = $controller('videosController', {
      videosService: videosService
    });
  })

  describe('getVideos', function () {

    it('should get videos from videosServices when controller init', function () {
      expect(videosService.getVideos).toHaveBeenCalled();
    }); 

    it('should assign response value to videos variable after get videos from service', function() {
      expect(videosCtrl.videos[0].name).toEqual('[0] Getting Started With ReactJs');
    });

  });

});
