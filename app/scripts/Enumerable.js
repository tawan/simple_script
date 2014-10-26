var SimpleScript = (function(my) {
  var enumerable = Object.create(Array.prototype);
  var iterator = function(fn) {
    for (var i = 0; i < this.length; i++) {
      fn(this[i]);
    }
  };

  var contains = function(obj) {
    var contains = false;
    this.each(function(item) {
      if (item == obj) {
        contains = true;
      }
    });
    return contains;
  }

  enumerable.each = iterator;
  enumerable.contains = contains;
  my.createEnumerable = function(arr) {
    if (typeof arr == "undefined") {
      return Object.create(enumerable);
    }
    else {
      arr.each = iterator;
      arr.contains = contains;
      return arr;
    }
  };

  return my;
})(SimpleScript || {});
