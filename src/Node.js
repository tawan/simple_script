var SimpleScript = (function(my) {

  my.treeFactory = (function() {
    var node = {
      children: function() {
        return this._children;
      },

      visit: function(programm) {
        this.children().each(function(child) { child.visit(programm); });
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

    var multiplication = Object.create(node);
    multiplication.visit = function(programm) {
      this._left.visit(programm);
      this._right.visit(programm);
      programm.push([ "MUL" ]);
    }

    return {
      createNode: function(children) {
        if (typeof children == "undefined") {
          children = my.createEnumerable();
        }
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
      },

      createMultiplication: function(left, right) {
        var m = Object.create(multiplication);
        m._left = left;
        m._right = right;
        return m;
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

        return self.stack().pop();
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
      },

      "MUL": function() {
        var left = this.stack().pop();
        var right = this.stack().pop();
        this.stack().push(left * right);
      }
    };
  };

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
