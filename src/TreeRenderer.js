var SimpleScript = (function(my) {
  my.treeRenderer = {
    render: function(root, element) {
      
    },

    decorate: function(tree) {
      var treeWalker = SimpleScript.createTreeWalker(tree);
      treeWalker.each(function(node) {
        node.insertIntoDomElement = function(parentElement) {
          
        };
      });
    }
  };

  return my;
})(SimpleScript || {});
