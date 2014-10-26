var SimpleScript = (function(my) {
  my.createVM = function(readCallback, printCallback) {
    var stack = [];
    var memoryObserver = my.createEnumerable();

    var memory = {
      registerObserver: function(observer) {
        if (!this.isObservedBy(observer)) {
          memoryObserver.push(observer);
        }
      },

      isObservedBy: function(obj) {
        return memoryObserver.contains(obj);
      },

      insert: function(segment, index, value) {
        this[segment][index] = value;
        memoryObserver.each(function(observer) {
          observer.notify('insert', segment, index, value);
        });
      },

      get: function(segment, index) {
        return this[segment][index];
      },

      local: (function() {
        var storage = [];
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
        var value = this.memory().get(segment, index);
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

      "POP": function(segment) {
        var value = this.stack().pop();
        var index = this.stack().pop();
        this.memory().insert(segment, index,  value);
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

      "MALLOC": function(segment) {
        var size = this.stack().pop();
        var adress = this.currentInstructions().malloc(size);
        this.stack().push(adress);
      },

      "DUP": function(segment) {
        var item = this.stack().pop();
        this.stack().push(item);
        this.stack().push(item);
      },

      stackPointer: function() {
        return stackPointer;
      },

      "LABEL": function(label) {
        //do nothing
      },

      "READ": function(segment) {
        var index = this.stack().pop();
        if(typeof this.readCallback == 'function') {
          var value = this.readCallback();
          var adress = this.currentInstructions().malloc(value.length);
          this.memory()[segment][index] = adress;
          for(var i = adress; i < adress + value.length; i++) {
            this.memory()[segment][i] = value[i - adress].charCodeAt(0);
          } 
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
      if ( typeof variablesIndexMapping[variable] === 'undefined') {
        variablesIndexMapping[variable] = variablesCount;
        variablesCount++;
      }

      return variablesIndexMapping[variable];
    };
    set.createLabel = function() {
        return labelCount++;
    };

    set.malloc = function(size) {
      var current = variablesCount;
      variablesCount = variablesCount + size;
      return current;
    };

    set.mapping = function() {
      return variablesIndexMapping;
    };

    return set;
  };

  return my;
})(SimpleScript || {});
