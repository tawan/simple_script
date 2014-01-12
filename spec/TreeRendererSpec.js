describe("SimpleScript", function() {
  describe("TreeRenderer", function() {
    var subject = SimpleScript.treeRenderer;
    var tree;

    beforeEach(function() {
      var children = SimpleScript.createEnumerable();
      children.push(SimpleScript.treeFactory.createNode());
      children.push(SimpleScript.treeFactory.createNode());

      tree = SimpleScript.treeFactory.createNode(children);
    });

    it("renders a node", function() {
      var node = SimpleScript.treeFactory.createNode();
      var element = subject.render(node);

    });



    it("decorates all nodes with render functions", function() {
      subject.decorate(tree);
      var treeWalker = SimpleScript.createTreeWalker(tree);
      treeWalker.each(function(node) {
        expect(node.insertIntoDomElement).toBeDefined();
      });
    });
  });
});
