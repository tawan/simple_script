var SimpleScript = (function(my) {
  my.createVM = function() {
    var stack = [];

    var memory = {
      local: (function() {
        var storage = [];

        return {
          get: function(index) { return storage[index]; },
          push: function(item) { storage.push(item); }
        };
      })(),

      constant: {
        get: function(index) { return index; },
        push: function() { throw "Can't push to constant segment"; }
      }
    };

    return {
      execute: function(instructions) {
        var self = this;

        instructions.each(function(instruction) {
          self[instruction[0]](instruction[1], instruction[2]);
        });

        return self.stack().pop();
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
      }
    };
  };

  return my;
})(SimpleScript || {});
