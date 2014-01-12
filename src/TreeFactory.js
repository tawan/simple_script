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

    var ident = Object.create(node);
    ident.name = function() {
      return this._name;
    };
    ident.visit = function(programm) {
      var index = programm.getIndex(this.name());
      programm.push([ "PUSH", "local", index ]);
    };

    var addition = Object.create(node);
    addition.visit = function(programm) {
      this._left.visit(programm);
      this._right.visit(programm);
      programm.push([ "ADD" ]);
    };

    var multiplication = Object.create(node);
    multiplication.visit = function(programm) {
      this._left.visit(programm);
      this._right.visit(programm);
      programm.push([ "MUL" ]);
    };

    var assignment = Object.create(node);
    assignment.visit = function(programm) {
      this._expr.visit(programm);
      var index = programm.getIndex(this._ident.name());
      programm.push([ "POP", "local", index ]);
    };

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
      },

      createAssignment: function(ident, expr) {
        var a = Object.create(assignment);
        a._ident = this.createIdent(ident);
        a._expr = expr;
        return a;
      },

      createIdent: function(name) {
        var i = Object.create(ident);
        i._name = name;
        return i;
      }
    };
  })();

  var treeWalker = (function() {
    var walkerFunc = function walkerFunc(node, fn) {
      fn(node);
      node.children().each(function(child) {
        walkerFunc(child, fn);
      });
    };

    return {
      each: function(fn) {
        walkerFunc(this._tree, fn);
      }
    };
  })();

  my.createTreeWalker = function(tree) {
    var t = Object.create(treeWalker);
    t._tree = tree;
    return t;
  };
  return my;
})(SimpleScript || {});
