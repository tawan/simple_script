var SimpleScript = (function(my) {
  my.factory = (function() {
    var node = {
      evalImpl: function() {
        return null;
      }
    }
    return {
      createNode: function() {
        var result;
        newNode = Object.create(node);
        newNode.eval = function() {
          result = this.evalImpl();
          return result;
        };
        return Object.create(node);
      },

      createNumber: function(value) {
        
      }
    };
  })();

  return my;
})(SimpleScript || {});
