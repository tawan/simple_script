var SimpleScript = (function(my) {
  my.createVM = function(readCallback, printCallback) {
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
      })(),

      ascii: (function() {
        var storage = {};
        for (var i = 0; i < 128; i++) {
          storage[String.fromCharCode(i)] = i;
        };

        return storage;
      })()
    };

    var stackPointer = 0;
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
      readCallback: (readCallback || function() { return "no read callback"; }),

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

      memory: function() {
        return memory;
      },

      "PUSH": function(segment, index) {
        if ( typeof index === 'undefined') {
          index = this.stack().pop();
        }
        var value = this.memory()[segment][index];
        this.stack().push(value);
      },

      "ADD": function() {
        var right = this.stack().pop();
        var left = this.stack().pop();
        this.stack().push(left + right);
      },

      "MUL": function() {
        var right = this.stack().pop();
        var left = this.stack().pop();
        this.stack().push(left * right);
      },

      "POP": function(segment, index) {
        var value = this.stack().pop();
        this.memory()[segment][index] =  value;
      },

      "EQUALS": function() {
        var right = this.stack().pop();
        var left = this.stack().pop();
        this.stack().push(left == right ? 1 : 0);
      },

      "ISNOT": function() {
        var right = this.stack().pop();
        var left = this.stack().pop();
        this.stack().push(left != right ? 1 : 0);
      },

      "GREATER": function() {
        var right = this.stack().pop();
        var left = this.stack().pop();
        this.stack().push(left > right ? 1 : 0);
      },

      "LOWER": function() {
        var right = this.stack().pop();
        var left = this.stack().pop();
        this.stack().push(left < right ? 1 : 0);
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

      "READ": function(segment, index) {
        if(typeof this.readCallback == 'function') {
            this.memory()[segment][index] =  this.readCallback();
        }
        else {
          throw "Cannot read because no callback is set!";
        }
      },
      stackPointer: function() {
        return stackPointer;
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

      "STRING": function(charCount, adress) {
        for (var i = charCount; i > 0; i--) {
          var currChar = this.stack().pop();
          this.memory()['local'][adress + i] = currChar;
        }

        this.memory()['local'][adress] = charCount;
        this.stack().push(adress);
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
    var labelCount = 0;

    set.getIndex = function(variable) {
      if(variable === null) {
        var index = variablesCount;
        variablesCount++;
        return index;
      }
      if ( typeof variablesIndexMapping[variable] === 'undefined') {
        variablesIndexMapping[variable] = variablesCount;
        variablesCount++;
      }

      return variablesIndexMapping[variable];
    };
    set.createLabel = function() {
        return labelCount++;
    };


    return set;
  };

  return my;
})(SimpleScript || {});
