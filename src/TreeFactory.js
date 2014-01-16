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
      },

      line: function() {
        return this._line;
      },

      isNode: true
    };

    var nodeTypes = {
      defaultType: node,

      number: (function() {
        var n = Object.create(node);
        n.visit = function(programm) {
          programm.push({ line: this.line(), instr: [ "PUSH", "constant", this.nativeValue() ] });
        };

        n.nativeValue = function() {
          return Number(this._value);
        };
        return n;
      })(),

      ident: (function() {
        var n = Object.create(node);
        n.name = function() {
          return this._value;
        };

        n.visit = function(programm) {
          var index = programm.getIndex(this.name());
          programm.push({ line: this.line(), instr: [ "PUSH", "local", index ] });
        };
        return n;
      })(),

      addition: (function() {
        var n = Object.create(node);
        n.visit = function(programm) {
          this.children().each(function(c) {
            c.visit(programm);
          });
          programm.push({ line: this.line(), instr: [ "ADD" ] });
        };

        return n;
      })(),

      multiplication: (function() {
        var n = Object.create(node);
        n.visit = function(programm) {
          this.children().each(function(c) {
            c.visit(programm);
          });
          programm.push({ line: this.line(), instr: [ "MUL" ] });
        };

        return n;
      })(),

      assignment: (function() {
        var n = Object.create(node);
        n.visit = function(programm) {
          this.children()[1].visit(programm);
          var index = programm.getIndex(this.children()[0].name());
          programm.push({ line: this.line(), instr: [ "POP", "local", index ] });
        };

        return n;
      })()
    };

    return {
      createNode: function(spec) {
        spec = spec || {};
        spec.type = spec.type || "defaultType";
        var newNode = Object.create(nodeTypes[spec.type]);
        newNode.type = spec.type;
        newNode._children = my.createEnumerable(spec.children);
        newNode._value = spec.value;
        newNode._line = spec.line;
        return newNode;
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
