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

    var stepCounter = 0;
    var currentInstructions;

    return {
      run: function() {
        while(this.hasPendingInstructions()) {
          this.step();
        }
      },

      step: function() {
        var instruction = this.currentInstructions()[stepCounter].instr;
        var line = this.currentInstructions()[stepCounter].line;
        if (!instruction) {
          throw "Cannot execute instruction!";
        }
        if (typeof line === 'number' && this.lineHighlighter) {
          this.lineHighlighter(line);
        }
        this[instruction[0]](instruction[1], instruction[2]);
        stepCounter++;
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
        return stepCounter < this.currentInstructions().length;
      },

      stack: function() {
        return stack;
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

      "PRINT": function() {
        if(typeof this.printCallback == 'function') {
          var value = this.stack().pop();
          this.printCallback(value);
        }
        else {
          throw "Cannot print because no callback is set!";
        }
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
