SimpleScript = {
  create: function(script) {
    jQuery.each(script, function(i, value) {
      value.exec();
    });
  },

  assignment: function(ident, expression) {
    return {
      exec: function() { SimpleScript.heap[ident] = expression.exec(); } 
    };
  },

  multiply: function(x, y) {
    return {
      exec: function() { return(x.exec() * y.exec()); } 
    };
  },

  number: function(num) {
    return {
      exec: function() { return Number(num); } 
    };
  },

  heap: {}

  output: function(script, element) {
    jQuery.each(script, function(i, stmt) {
      var newDiv = document.createElement("<div");
      stmt.insert(newDiv);
      element.append(newDiv);
    });
  }
}
