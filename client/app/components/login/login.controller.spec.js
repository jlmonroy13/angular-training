describe('Login controller', function () {

  var $controller, $q, $rootScope, loginCtrl, deferred, $httpBackend, Login;

  beforeEach(module('video-portal'));

  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_,  _$httpBackend_, _Login_){
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    deferred = _$q_.defer();
    Login = _Login_;
  }));

  beforeEach(function() {
    loginCtrl = $controller('loginController', {
      Login: Login
    });
  })

  beforeEach(function() {
    spyOn(Login, 'save').and.returnValue(deferred.promise);
  })

  describe('authenticateUser', function () {

    it('should return the session id if the request was successful', function () {
      deferred.resolve({data: {sessionId: 'm6dh4PnONIHYnlhphpZlqzKqMJR58o6A'}});
      $httpBackend.expect('GET', 'app/components/dashboard/dashboard.html').respond(200);
      $httpBackend.expect('GET', 'app/components/videos/videos.html').respond(200);
      loginCtrl.authenticateUser();
      $rootScope.$apply();
      $httpBackend.flush();
      expect(loginCtrl.sessionId).toEqual('m6dh4PnONIHYnlhphpZlqzKqMJR58o6A');
    }); 

    it("should call setCurrentUser function if the request was successful", function() {
      deferred.resolve({data: {sessionId: 'm6dh4PnONIHYnlhphpZlqzKqMJR58o6A'}});
      spyOn(loginCtrl, "setCurrentUser");
      $httpBackend.expect('GET', 'app/components/dashboard/dashboard.html').respond(200);
      $httpBackend.expect('GET', 'app/components/videos/videos.html').respond(200);
      loginCtrl.authenticateUser();
      $rootScope.$apply();
      $httpBackend.flush();
      expect(loginCtrl.setCurrentUser).toHaveBeenCalled();
    }); 

    it("should set an error message if username or password is invalid", function() {
      deferred.resolve({data: {error: 'Invalid username or password'}});
      $httpBackend.expect('GET', 'app/components/login/login.html').respond(200);
      loginCtrl.authenticateUser();
      $rootScope.$apply();
      $httpBackend.flush();
      expect(loginCtrl.errorMessage).toEqual('Invalid username or password');
    }); 

    it("should set an error message if username or password is missing", function() {
      deferred.reject({data: {error: 'Username or password is missing.'}});
      $httpBackend.expect('GET', 'app/components/login/login.html').respond(200);
      loginCtrl.authenticateUser();
      $rootScope.$apply();
      $httpBackend.flush();
      expect(loginCtrl.errorMessage).toEqual('Username or password is missing.');
    });

  });

});
