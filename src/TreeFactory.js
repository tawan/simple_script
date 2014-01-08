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
      programm.push([ "PUSH", "constant", this.nativeValue ]);
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

  return my;
})(SimpleScript || {});
