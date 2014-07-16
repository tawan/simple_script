describe("SimpleScript", function() {
  describe("TreeRenderer", function() {
    var subject = SimpleScript.treeRenderer;
    var tree;

    beforeEach(function() {
      var children = SimpleScript.createEnumerable();
      children.push(SimpleScript.treeFactory.createNode());
      children.push(SimpleScript.treeFactory.createNode());

      tree = SimpleScript.treeFactory.createNode({ children: children });
    });

    it("decorates all nodes with render functions", function() {
      subject.decorate(tree);
      var treeWalker = SimpleScript.createTreeWalker(tree);
      treeWalker.each(function(node) {
        expect(node.insertIntoDomElement).toBeDefined();
      });
    });

    describe("decoreated tree", function() {
      var parentElement;

      beforeEach(function() {
        subject.decorate(tree);
        parentElement = jQuery(document.createElement('div'));
      });

      it("renders a node", function() {
        subject.render(tree, parentElement);
        expect(parentElement.html()).toEqual("<div><div></div><div></div></div>");
      });

      it("renders a number node", function() {
        var node = SimpleScript.treeFactory.createNode({ type: "number", value: "4" });
        subject.decorate(node);
        subject.render(node, parentElement);
        expect(parentElement.html()).toEqual("<span>4</span>")
      });

      it("renders an ident node", function() {
        var node = SimpleScript.treeFactory.createNode({ type: "ident", value: "x" });;
        subject.decorate(node);
        subject.render(node, parentElement);
        expect(parentElement.html()).toEqual("<span>x</span>")
      });

      describe("binary operations", function() {
        var left, right;

        beforeEach(function() {
          left = SimpleScript.treeFactory.createNode({ type: "number", value: "2" });;
          right = SimpleScript.treeFactory.createNode({ type: "number", value: "3" });;
        });

        it("renders a multiplication node", function() {
          var node = SimpleScript.treeFactory.createNode({ type: "multiplication", children: [ left, right] });;
          subject.decorate(node);
          subject.render(node, parentElement);
          expect(parentElement.html()).toEqual("<span>2</span><span>*</span><span>3</span>")
        });

        it("renders an addition node", function() {
          var node = SimpleScript.treeFactory.createNode({ type: "addition", children: [ left, right] });;
          subject.decorate(node);
          subject.render(node, parentElement);
          expect(parentElement.html()).toEqual("<span>2</span><span>+</span><span>3</span>")
        });

        it("renders an assignemt node", function() {
          left = SimpleScript.treeFactory.createNode({ type: "ident", value: "x" });;
          var node = SimpleScript.treeFactory.createNode({ type: "assignment", children: [ left, right] });;
          subject.decorate(node);
          subject.render(node, parentElement);
          expect(parentElement.html()).toEqual("<span>x</span><span>=</span><span>3</span>")
        });
      });
    });
  });
});
