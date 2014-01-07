var SimpleScript = (function(my) {

  my.treeFactory = (function() {
    var node = {
      children: function() {
        return this._children;
      }
    };

    var number = Object.create(node);
    number.visit = function(programm) {
      programm.push([ "PUSH", this.nativeValue ]);
    };

    var addition = Object.create(node);
    addition.visit = function(programm) {
      this._left.visit(programm);
      this._right.visit(programm);
      programm.push([ "ADD" ]);
    }

    return {
      createNode: function() {
        var children = [];
        var newNode = Object.create(node);
        newNode._children = children;
        return newNode;
      },

      createNumber: function(value) {
        var newNumber = Object.create(number);
        newNumber.nativeValue = Number(value);
        return newNumber;
      },

      createAddition: function(left, right) {
        var newAddition = Object.create(addition);
        newAddition._left = left;
        newAddition._right = right;
        return newAddition;
      }
    };
  })();

  my.createVM = function() {
    var stack = [];
    return {
      execute: function(instructions) {
        var self = this;

        instructions.each(function(instruction) {
          self[instruction[0]](instruction[1]);
        });
      },

      stack: function() {
        return stack;
      },

      "PUSH": function(value) {
        this.stack().push(value);
      },

      "ADD": function() {
        var left = this.stack().pop();
        var right = this.stack().pop();
        this.stack().push(left + right);
      }
    };
  };

  var enumerable = {
    each: function(fn) {
      var array = this._array;
      for (var i = 0; i < this._array.length; i++) {
        fn(array[i]);
      }
    }
  };

  my.createEnumerable = function() {
    var e = Object.create(enumerable);
    e._array = arguments.length > 0 ? arguments[0] : [];
    return e;
  };

  return my;
})(SimpleScript || {});
