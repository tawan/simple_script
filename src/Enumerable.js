var SimpleScript = (function(my) {
  var enumerable = Object.create(Array.prototype);
  enumerable.each = function(fn) {
    for (var i = 0; i < this.length; i++) {
      fn(this[i]);
    }
  };

  my.createEnumerable = function() {
    return Object.create(enumerable);
  };

  return my;
})(SimpleScript || {});
