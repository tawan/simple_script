var SimpleScript = (function(my) {
  my.treeRenderer = {
    render: function(root, element) {
      root.insertIntoDomElement(element);
    },

    decorate: function(tree) {
      var treeWalker = SimpleScript.createTreeWalker(tree);
      treeWalker.each(function(node) {
        node.insertIntoDomElement = function(parentElement) {
          var element = this.createDomElement();
          parentElement.append(element);
          node.children().each(function(child) {
            child.insertIntoDomElement(element);
          });
        };

        switch(node.type) {
          case "number":
            node.createDomElement = function() {
              var el = jQuery(document.createElement('span'));
              el.text(node.nativeValue);
              return el;
            };
            break;

          case "ident":
            node.createDomElement = function() {
              var el = jQuery(document.createElement('span'));
              el.text(node.name());
              return el;
            };
            break;

          case "multiplication":
            node.insertIntoDomElement = function(parentElement) {
              node.children()[0].insertIntoDomElement(parentElement);
              var star = jQuery(document.createElement('span'));
              star.text('*');
              parentElement.append(star);
              node.children()[1].insertIntoDomElement(parentElement);
            };
            break;

          case "addition":
            node.insertIntoDomElement = function(parentElement) {
              node.children()[0].insertIntoDomElement(parentElement);
              var star = jQuery(document.createElement('span'));
              star.text('+');
              parentElement.append(star);
              node.children()[1].insertIntoDomElement(parentElement);
            };
            break;

          case "assignment":
            node.insertIntoDomElement = function(parentElement) {
              node.children()[0].insertIntoDomElement(parentElement);
              var star = jQuery(document.createElement('span'));
              star.text('=');
              parentElement.append(star);
              node.children()[1].insertIntoDomElement(parentElement);
            };
            break;

          default:
            node.createDomElement = function() {
              return jQuery(document.createElement('div'));
            };
        };
      });
    }
  };

  return my;
})(SimpleScript || {});
