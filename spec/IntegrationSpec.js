describe("SimpleScript", function() {
  describe("simple program", function() {
    var programm = "x = 2; y = (1 + x) * (5 + 5); x = y + 1; x;";
    var tree;
    beforeEach(function() {
      tree = grammar.parse(programm);
    });

    it("performs correctly", function() {
      var instructions = SimpleScript.createInstructionSet();
      tree.visit(instructions);
      var vm = SimpleScript.createVM();
      vm.load(instructions);
      vm.run();
    });
  });
});
