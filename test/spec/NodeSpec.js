describe("SimpleScript", function() {
  var programm;

  beforeEach(function() {
    programm = [];
  });

  describe("treeFactory", function() {
    describe("Node", function() {
      var subject;
      beforeEach(function() { subject = SimpleScript.treeFactory.createNode(); });

      it("has children", function() {
        expect(subject.children().each).toBeDefined();
      });
    });

    describe("Number", function() {
      var number;
      var value = "4";
      var nativeValue = Number(value);

      beforeEach(function() {
        number = SimpleScript.treeFactory.createNumber(value);
      });

      describe("#visit", function() {
        it("pushes its native value", function() {
          number.visit(programm);
          expect(programm.pop()).toEqual([ "PUSH", nativeValue ]);
        });
      });
    });

    describe("Addition", function() {
      var addition, left, right;

      beforeEach(function() {
        left = jasmine.createSpyObj("left", [ "visit" ]);
        right = jasmine.createSpyObj("right", [ "visit" ]);
        addition = SimpleScript.treeFactory.createAddition(left, right);
      });

      describe("#visit", function() {
        beforeEach(function() { addition.visit(programm); });

        it("visits its children", function() {
          expect(left.visit).toHaveBeenCalledWith(programm);
          expect(right.visit).toHaveBeenCalledWith(programm);
        });

        it("instructs to add", function() {
          expect(programm.pop()).toEqual([ "ADD" ]);
        });
      });
    });

    describe("Multiplication", function() {
      var addition, left, right;

      beforeEach(function() {
        left = jasmine.createSpyObj("left", [ "visit" ]);
        right = jasmine.createSpyObj("right", [ "visit" ]);
        addition = SimpleScript.treeFactory.createMultiplication(left, right);
      });

      describe("#visit", function() {
        beforeEach(function() { addition.visit(programm); });

        it("visits its children", function() {
          expect(left.visit).toHaveBeenCalledWith(programm);
          expect(right.visit).toHaveBeenCalledWith(programm);
        });

        it("instructs to mulitply", function() {
          expect(programm.pop()).toEqual([ "MUL" ]);
        });
      });
    });
  });

  describe("virtual machine", function() {
    var subject, instruction_1, instruction_2, instructions;

    beforeEach(function() {
      subject = SimpleScript.createVM();
      instruction_1 = [ "PUSH" , 2 ];
      instruction_2 = [ "ADD" ]
      instructions = SimpleScript.createEnumerable();
      instructions.push(instruction_1);
      instructions.push(instruction_2);
    });

    describe("#execute", function() {
      beforeEach(function() {
        spyOn(subject, "PUSH").and.callThrough();
        spyOn(subject, "ADD").and.callThrough();
        subject.execute(instructions);
      });

      it("executes each instruction", function() {
        expect(subject["PUSH"]).toHaveBeenCalledWith(2);
        expect(subject["ADD"]).toHaveBeenCalled();
      });
    });

    describe("#PUSH", function() {
      it("pushes a value to the stack", function() {
        subject["PUSH"](666);
        expect(subject.stack().pop()).toEqual(666);
      });
    });

    describe("#ADD", function() {
      it("pops two values and adds them and writes the sum back to the stack", function() {
        var left = 3;
        var right = 4
        var sum = left + right;
        subject.stack().push(left);
        subject.stack().push(right);
        subject["ADD"]();
        expect(subject.stack().pop()).toEqual(sum);
      });
    });

    describe("#MUL", function() {
      it("pops two values and mulitplies them and writes the sum back to the stack", function() {
        var left = 3;
        var right = 4
        var product = left * right;
        subject.stack().push(left);
        subject.stack().push(right);
        subject["MUL"]();
        expect(subject.stack().pop()).toEqual(product);
      });
    });
  });

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
