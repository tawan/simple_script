SimpleScript = {
  create: function(script) {
    return script;
  },

  assignment: function(ident, expression) {
    return {
      exec: function() { SimpleScript.heap[ident] = expression.exec(); },
      output: function() {
        this.el = jQuery(document.createElement("div"));
        var left = jQuery(document.createElement("div"));
        left.html(ident);
        var equal = jQuery(document.createElement("div"));
        equal.html(" = ");
        this.el.append(left);
        this.el.append(equal);
        this.el.append(expression.output());
        return this.el;
      }
    };
  },

  multiply: function(x, y) {
    return {
      exec: function() { return(x.exec() * y.exec()); },
      output: function() {
        this.el = jQuery(document.createElement("div"));
        this.el.append(x.output());
        this.star = jQuery(document.createElement("div"));
        this.star.html("*");
        this.el.append(this.star);
        this.el.append(y.output());
        return this.el;
      }
    };
  },

  number: function(num) {
    return {
      exec: function() { return Number(num); },
      output: function() {
        var el = jQuery(document.createElement("div"));
        el.html(num);
        this.el = el;
        return el;
      }
    };
  },

  heap: {},

  output: function(script, element) {
    jQuery.each(script, function(i, stmt) {
      element.append(stmt.output());
    });
  }
}
