var SimpleScript = (function(my) {

  my.treeFactory = (function() {
    var node = {
      children: function() {
        if (typeof this._children == "undefined") {
          this._children = SimpleScript.createEnumerable();
        }
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
    number.type = 'number';

    var ident = Object.create(node);
    ident.name = function() {
      return this._name;
    };
    ident.visit = function(programm) {
      var index = programm.getIndex(this.name());
      programm.push([ "PUSH", "local", index ]);
    };
    ident.type = 'ident';

    var addition = Object.create(node);
    addition.visit = function(programm) {
      this.children().each(function(c) {
        c.visit(programm);
      });
      programm.push([ "ADD" ]);
    };
    addition.type = 'addition';

    var multiplication = Object.create(node);
    multiplication.visit = function(programm) {
      this.children().each(function(c) {
        c.visit(programm);
      });
      programm.push([ "MUL" ]);
    };
    multiplication.type = 'multiplication';

    var assignment = Object.create(node);
    assignment.visit = function(programm) {
      this.children()[1].visit(programm);
      var index = programm.getIndex(this.children()[0].name());
      programm.push([ "POP", "local", index ]);
    };
    assignment.type = 'assignment';

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
        var a = Object.create(addition);
        a.children().push(left);
        a.children().push(right);
        return a;
      },

      createMultiplication: function(left, right) {
        var m = Object.create(multiplication);
        m.children().push(left);
        m.children().push(right);
        return m;
      },

      createAssignment: function(ident, expr) {
        var a = Object.create(assignment);
        a.children().push(this.createIdent(ident));
        a.children().push(expr);
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
