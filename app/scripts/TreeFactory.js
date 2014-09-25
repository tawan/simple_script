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
        this.pushToStack(programm);
      },

      line: function() {
        return this._line;
      },

      firstColumn: function() {
        return this._firstColumn
      },

      lastColumn: function() {
        return this._lastColumn
      },

      pushToStack: function(programm) {
        // implement in node types
      }
    };

    var nodeTypes = {
      defaultType: node,

      number: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "PUSH", "constant", this.nativeValue() ] });
        };

        n.nativeValue = function() {
          return Number(this._value);
        };
        return n;
      })(),

      _char: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "PUSH", "ascii", this.nativeValue() ] });
        };

        n.nativeValue = function() {
          return this._value.charCodeAt(0);
        };
        return n;
      })(),

      string: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          var charCount = this.children().length
          var adress = programm.getIndex(null);
          for (var i = 0; i < charCount; i++) {
            programm.getIndex(null);
          }
          programm.push({ line: this.line(), instr: [ "STRING", charCount, adress ] });
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
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "ADD" ] });
        };

        return n;
      })(),

      multiplication: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "MUL" ] });
        };

        return n;
      })(),

      lower: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "LOWER" ] });
        };

        return n;
      })(),

      equals: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "EQUALS" ] });
        };

        return n;
      })(),

      whileLoop: (function() {
        var n = Object.create(node);
        n.visit = function(programm) {
          var end_label = programm.createLabel();
          var begin_label = programm.createLabel();
          this.children()[0].visit(programm);
          programm.push({ line: this.line(), instr: [ "PUSH", 'constant', 0 ] });
          programm.push({ line: this.line(), instr: [ "EQUALS" ] });
          programm.push({ line: this.line(), instr: [ "JUMP_ON_TRUE", end_label, 'f' ] });
          programm.push({ line: this.line(), instr: [ "LABEL", begin_label ] });
          this.children()[1].visit(programm);
          this.children()[0].visit(programm);
          programm.push({ line: this.line(), instr: [ "JUMP_ON_TRUE", begin_label, 'b' ] });
          programm.push({ line: this.line(), instr: [ "LABEL", end_label ] });
        };

        return n;
      })(),

      isnot: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "ISNOT" ] });
        };

        return n;
      })(),

      greater: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "GREATER" ] });
        };

        return n;
      })(),

      print: (function() {
        var n = Object.create(node);
        n.pushToStack = function(programm) {
          programm.push({ line: this.line(), instr: [ "PRINT" ] });
        };

        return n;
      })(),

      read: (function() {
        var n = Object.create(node);
        n.visit = function(programm) {
          var index = programm.getIndex(this.children()[0].name());
          programm.push({ line: this.line(), instr: [ "READ", "local", index ] });
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
        newNode._firstColumn = spec.firstColumn;
        newNode._lastColumn = spec.lastColumn;
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
