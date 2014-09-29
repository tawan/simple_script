describe("SimpleScript", function() {
  describe("simple program", function() {
    var programm = "x = read; y = (1 + x) * (5 + 5); x = y * 2 * 3; x;";
    var tree;
    beforeEach(function() {
      tree = grammar.parse(programm);
    });

    it("performs correctly", function() {
      var instructions = SimpleScript.createInstructionSet();
      tree.visit(instructions);
      var vm = SimpleScript.createVM(function() {return 2;});
      vm.load(instructions);
      vm.run();
      expect(vm.stack().pop()).to.equal(180);
    });
  });

  describe("program with while loops", function() {
    var programm = "x = 0; y = 0; while (x < 5) { x = x + 1; while (y < 100) { y = y + x; }; }; x + y;"
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
      expect(vm.stack().pop()).to.equal(105);
    });
  });

  describe("program with arrays", function() {
    var programm = "x = array(2);y = 4; x[0] = (y + 1); x[1] = 3; z = x[0] * x[1] * y; z;"
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
      expect(vm.stack().pop()).to.equal(60);
    });
  });
});
