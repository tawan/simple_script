var SimpleScript = (function(my) {
  my.createVM = function() {
    var stack = [];
    return {
      execute: function(instructions) {
        var self = this;

        instructions.each(function(instruction) {
          self[instruction[0]](instruction[1]);
        });

        return self.stack().pop();
      },

      stack: function() {
        return stack;
      },

      "PUSH": function(value) {
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
