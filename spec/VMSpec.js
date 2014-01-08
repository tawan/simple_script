describe("SimpleScript", function() {
  var programm;

  beforeEach(function() {
    programm = [];
  });

  describe("virtual machine", function() {
    var subject;

    beforeEach(function() {
      subject = SimpleScript.createVM();
    });

    describe("memory", function() {
      beforeEach(function() {
        subject = subject.memory();
      });

      it("has segment for local variables", function() {
        expect(subject.local).toBeDefined();
      });

      describe("locals segment", function() {
        beforeEach(function() {
          subject = subject.local;
        });

        it("can add values", function() {
          subject.push(666)
          expect(subject.get(0)).toBe(666);
        });
      });

      it("has segment for constants", function() {
        expect(subject.constant).toBeDefined();
      });

      describe("constants segment", function() {
        beforeEach(function() {
          subject = subject.constant;
        });
        it("is initialized with unsigned 8 bit values", function() {
          expect(subject.get(0)).toBe(0);
          expect(subject.get(255)).toBe(255);
        });
      });
    });

    describe("#execute", function() {
      var instruction_1, instruction_2, instructions;
      beforeEach(function() {
        spyOn(subject, "PUSH").and.callThrough();
        spyOn(subject, "ADD").and.callThrough();
        instruction_1 = [ "PUSH" , "local", 2 ];
        instruction_2 = [ "ADD" ];
        instructions = SimpleScript.createEnumerable();
        instructions.push(instruction_1);
        instructions.push(instruction_2);
        subject.execute(instructions);
      });

      it("executes each instruction", function() {
        expect(subject["PUSH"]).toHaveBeenCalledWith("local", 2);
        expect(subject["ADD"]).toHaveBeenCalled();
      });
    });

    describe("#PUSH", function() {
      it("pushes a value from a given segment with a given indes to the stack", function() {
        subject.memory().local.push(666);
        subject["PUSH"]("local", 0);
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

    describe("#POP", function() {
      it("pops value and stores it into given segment at given index", function() {
        subject.stack().push(666);
        subject["POP"]("local", 0);
        expect(subject.memory().local.get(0)).toEqual(666);
      });
    });
  });

  describe("instruction set", function() {
    var subject;

    beforeEach(function() {
      subject = SimpleScript.createInstructionSet();
    });

    it("is enumerable", function() {
      expect(subject.each).toBeDefined();
    });

    it("maps variables to indices", function() {
      expect(subject.getIndex("x")).toBe(0);
      expect(subject.getIndex("y")).toBe(1);
      expect(subject.getIndex("x")).toBe(0);
    });
  });
});
