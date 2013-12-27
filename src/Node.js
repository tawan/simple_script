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
    this.eval = function() {
      if (this.result() != undefined) {
        return this.result();
      }
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

  my.Number = function(value) {
    this.evalImpl = function() {
      return Number(value);
    }
  };

  my.Number.prototype = new my.Node();

  my.Addition = function(left, right) {
    this.evalImpl = function() {
      return left.eval() + right.eval();
    }
  }

  my.Addition.prototype = my.Number.prototype;
  return my;
})(SimpleScript || {});
