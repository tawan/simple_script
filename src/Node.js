var SimpleScript = (function(my) {
  my.Enumerable = function() {
    this.each = function(fn) {
      for (var i = 0; i < this.length; i++) {
        fn(this[i]);
      }
    }
  };

  my.Enumerable.prototype = Object.create(Array.prototype);

  my.Node = function() {
    var result;

    this.eval = function() {
      result = this.evalImpl();
      return result;
    };

    this.evalImpl = function() {
      //Inheriting Nodes have to implement this function.
      return null;
    };

    this.result = function() {
      return result;
    }
  };

  my.NumberNode = function(value) {
    this.evalImpl = function() {
      return Number(value);
    }
  };

  my.NumberNode.prototype = Object.create(new my.Node());

  return my;
})(SimpleScript || {});
