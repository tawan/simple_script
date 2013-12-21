SimpleScript = {
  create: function(script) {
    return script;
  },

  assignment: function(ident, expression) {
    return {
      exec: function(q) {
        SimpleScript.heap[ident] = expression.exec(q);
        var that = this;
        q.push(function() { that.el.toggle(); that.el.toggle("highlight"); });
      },

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
      exec: function(q) {
        var val = x.exec(q) * y.exec(q);
        var that = this;
        q.push(function() { that.el.toggle(); that.el.toggle("puff"); });
        q.push(function() { that.el.html(val); });
        return val;
      },

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
      exec: function(q) {
        return Number(num);
      },

      output: function() {
        var el = jQuery(document.createElement("div"));
        el.html(num);
        this.el = el;
        return el;
      }
    };
  },

  ident: function(ident) {
    return {
      exec: function(q) {
        var val = SimpleScript.heap[ident];
        var that = this;
        q.push(function() { that.el.toggle(); that.el.toggle("puff");});
        q.push(function() { that.el.html(val); });
        return val ;
      },

      output: function() {
        var el = jQuery(document.createElement("div"));
        el.html(ident);
        this.el = el;
        return el;
      }
    };
  },

  heap: {},

  output: function(script, element) {
    jQuery.each(script, function(i, stmt) {
      var div = jQuery(document.createElement("div"));
      div.addClass("no-inline");
      div.append(stmt.output());
      element.append(div);
    });
  }
}
