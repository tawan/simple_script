describe("SimpleScript", function() {
  describe("simple program", function() {
    var programm = "read $x; $y = (1 + $x) * (5 + 5); $x = $y + 1; $x;";
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
      expect(vm.stack().pop()).to.equal(31);
    });
  });

  describe("program with while loops", function() {
    var programm = "$x = 0; $y = 0; while ($x < 5) { $x = $x + 1; while ($y < 100) { $y = $y + $x; }; }; $x + $y;"
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

  describe("program with string", function() {
    var programm = "$x = 'AbcD'; $x[1];"
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
      expect(vm.stack().pop()).to.equal('b'.charCodeAt(0));
    });
  });

  describe("program with array", function() {
    var programm = "$x = array(5 + 3); $x;"
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
      expect(vm.stack().pop()).to.equal(0);
    });
  });
});
