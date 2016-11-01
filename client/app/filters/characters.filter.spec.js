describe('Characters filter', function() {

  var $filter, characters;

  beforeEach(module('video-portal'));

  beforeEach(inject(function(_$filter_){
    $filter = _$filter_;
    characters = $filter('characters');
  }));

  it("returns an empty string when chars are set in 0", function() {
    expect(characters('Lorem ipsum dolor sit amet', 0)).toEqual('');
  });

  it("returns the correct value when given a string of chars", function() {
    expect(characters('Lorem ipsum dolor sit amet', 12)).toEqual('Lorem ipsum…');
  });

  it("returns the same given string if set chars are less than string length", function() {
    expect(characters('Lorem ipsum dolor sit amet', 30)).toEqual('Lorem ipsum dolor sit amet');
  });

});

