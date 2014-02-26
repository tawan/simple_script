describe("SimpleScript", function() {
  describe("Debugger", function() {
    var tree, subject, lineHighlighter;

    beforeEach(function() {
     var children = [
        SimpleScript.treeFactory.createNode({ line: 1 }),
        SimpleScript.treeFactory.createNode({ line: 2 })
      ];
      tree = SimpleScript.treeFactory.createNode({ children: children });
      subject = SimpleScript.createDebugger(tree);
      lineHighlighter = jasmine.createSpy("lineHighlighter");
    });

    it("decorates Node#visit to add a callback to the generated instructions", function() {
      subject.afterStepping(lineHighlighter);
    });
  });
});
