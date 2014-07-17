var SimpleScript = (function(my) {
  var enumerable = Object.create(Array.prototype);
  var iterator = function(fn) {
    for (var i = 0; i < this.length; i++) {
      fn(this[i]);
    }
  };

  enumerable.each = iterator;
  my.createEnumerable = function(arr) {
    if (typeof arr == "undefined") {
      return Object.create(enumerable);
    }
    else {
      arr.each = iterator;
      return arr;
    }
  };

  return my;
})(SimpleScript || {});
