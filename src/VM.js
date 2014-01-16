var SimpleScript = (function(my) {
  my.createVM = function() {
    var stack = [];

    var memory = {
      local: (function() {
        var storage = [];

        return {
          get: function(index) { return storage[index]; },
          push: function(item) { storage.push(item); },
          set:  function(index, item) { storage[index] = item; }
        };
      })(),

      constant: {
        get: function(index) { return index; },
        push: function() { throw "Can't push to constant segment"; }
      }
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
        if (!instruction) {
          throw "Cannot execute instruction!";
        }
        this[instruction[0]](instruction[1], instruction[2]);
        stepCounter++;
      },

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
        var value = this.memory()[segment].get(index);
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
        this.memory()[segment].set(index, value);
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
