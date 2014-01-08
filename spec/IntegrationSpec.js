describe("SimpleScript", function() {
  describe("simple program", function() {
    var programm = "(1 + 2) * (5 + 5);";
    var tree;
    beforeEach(function() {
      tree = grammar.parse(programm);
    });

    it("performs correctly", function() {
      var instructions = SimpleScript.createEnumerable();
      tree.visit(instructions);
      var vm = SimpleScript.createVM();
      var result = vm.execute(instructions);
      expect(result).toBe(30);
    });
  });
});
