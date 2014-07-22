var SimpleScript = (function(my) {
  my.createVM = function(printCallback) {
    var stack = [];

    var memory = {
      local: (function() {
        var storage = [];
        for (var i = 0; i < 10; i++) {
          storage.push(null);
        };

        return storage;
      })(),

      constant: (function() {
        var storage = [];
        for (var i = 0; i < 256; i++) {
          storage.push(i);
        };

        return storage;
      })()
    };

    var stackPointer = 0;
    var labelCount = 0;
    var currentInstructions;

    return {
      run: function() {
        while(this.hasPendingInstructions()) {
          this.step();
        }
      },

      step: function() {
        var instruction = this.currentInstructions()[stackPointer].instr;
        var line = this.currentInstructions()[stackPointer].line;
        if (!instruction) {
          throw "Cannot execute instruction!";
        }
        if (typeof line === 'number' && this.lineHighlighter) {
          this.lineHighlighter(line);
        }
        this[instruction[0]](instruction[1], instruction[2]);
        stackPointer++;
      },

      printCallback: (printCallback || function(value) { console.log(value) }),

      load: function(instructions) {
        currentInstructions = instructions;
      },

      currentInstructions: function() {
        if (!currentInstructions) {
          throw "VM has not instructions loaded!";
        }
        return currentInstructions;
      },

      hasPendingInstructions: function() {
        return stackPointer < this.currentInstructions().length;
      },

      stack: function() {
        return stack;
      },

      createLabel: function() {
        return labelCount++;
      },

      memory: function() {
        return memory;
      },

      "PUSH": function(segment, index) {
        var value = this.memory()[segment][index];
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
      },

      "POP": function(segment, index) {
        var value = this.stack().pop();
        this.memory()[segment][index] =  value;
      },

      "EQUALS": function() {
        var left = this.stack().pop();
        var right = this.stack().pop();
        this.stack().push(left == right);
      },

      "ISNOT": function() {
        var left = this.stack().pop();
        var right = this.stack().pop();
        this.stack().push(left != right);
      },

      "GREATER": function() {
        var left = this.stack().pop();
        var right = this.stack().pop();
        this.stack().push(left > right);
      },

      "LOWER": function() {
        var left = this.stack().pop();
        var right = this.stack().pop();
        this.stack().push(left < right);
      },

      "JUMP_ON_TRUE": function(label, direction) {
        if(!stack.pop()) {
          return;
        }
        var instr;
        var found = false;
        while(stackPointer < this.currentInstructions().length && stackPointer >= 0) {
          instr = this.currentInstructions()[stackPointer].instr;
          if(instr[0] == 'LABEL' && instr[1] == label) {
            found = true;
            break;
          };
          if(direction == 'f') {
            stackPointer++;
          }
          else if(direction == 'b') {
            stackPointer--;
          }
        }

        if(!found) {
          throw "Label not found";
        };
      },

      "LABEL": function(label) {
        //do nothing
      },

      "PRINT": function() {
        if(typeof this.printCallback == 'function') {
          var value = this.stack().pop();
          this.printCallback(value);
        }
        else {
          throw "Cannot print because no callback is set!";
        }
      },
      stackPointer: function() {
        return stackPointer;
      }
    };
  };

  my.createInstructionSet = function() {
    var set = my.createEnumerable();
    var variablesCount = 0;
    var variablesIndexMapping = {};

    set.getIndex = function(variable) {
      if ( typeof variablesIndexMapping[variable] === 'undefined') {
        variablesIndexMapping[variable] = variablesCount;
        variablesCount++;
      }

      return variablesIndexMapping[variable];
    };

    return set;
  };

  return my;
})(SimpleScript || {});