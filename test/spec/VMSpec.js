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

      it("maintains observer list", function() {
        var observer = {};
        subject.registerObserver(observer);
        expect(subject.isObservedBy(observer)).to.be.true;
      });

      it("has segment for local variables", function() {
        expect(subject.local).to.be.defined;
      });

      describe("locals segment", function() {
        beforeEach(function() {
          subject = subject.local;
        });

        it("can add values", function() {
          subject[0] =  666;
          expect(subject[0]).to.equal(666);
        });

        it("initializes with 10 null entries", function() {
          for(var i = 0; i < 10; i++) {
            expect(subject[i]).to.be.null;
          };
        });
      });

      it("has segment for constants", function() {
        expect(subject.constant).to.be.defined;
      });

      describe("constants segment", function() {
        beforeEach(function() {
          subject = subject.constant;
        });
        it("is initialized with unsigned 8 bit values", function() {
          expect(subject[0]).to.equal(0);
          expect(subject[255]).to.equal(255);
        });
      });
    });

    it("can load instructions", function() {
      var instructions = {};
      subject.load(instructions);
      expect(subject.currentInstructions()).to.equal(instructions);
    });

    describe("execution", function() {
      var instruction_1, instruction_2, instructions, pushSpy, addSpy;
      var line = 45;
      beforeEach(function() {
        pushSpy = sinon.spy(subject, "PUSH");
        addSpy = sinon.spy(subject, "ADD");
        instruction_1 = [ "PUSH" , "local", 2 ];
        instruction_2 = [ "ADD" ];
        instructions = SimpleScript.createInstructionSet();
        instructions.push({instr: instruction_1, line: line});
        instructions.push({instr: instruction_2, line: line});
        subject.load(instructions);
      });


      describe("#step", function() {
        var highlighter;

        beforeEach(function() {
          subject.step();
          highlighter = sinon.spy();
        });

        it("executes only one instruction", function() {
          expect(pushSpy.calledWith("local", 2)).to.be.true;
          expect(addSpy.called).to.be.not.true;
        });

        it("executes one instruction after the other", function() {
          expect(pushSpy.calledWith("local", 2)).to.be.true;
          subject.step();
          expect(addSpy.called).to.be.true;

        });

        it("can highlight a line", function() {
          subject.lineHighlighter = highlighter;
          subject.step();
          expect(highlighter.calledWith(line)).to.be.true;
        });
      });

      describe("#run", function() {
        beforeEach(function() {
          subject.run();
        });

        it("it executes all remaining instructions", function() {
          expect(pushSpy.calledWith("local", 2)).to.be.true;
          expect(addSpy.called).to.be.true;
        });
      });
    });

    describe("#PUSH", function() {
      it("pushes a value from a given segment with a given index to the stack", function() {
        subject.memory().local[0] =  666;
        subject["PUSH"]("local", 0);
        expect(subject.stack().pop()).to.equal(666);
      });

      describe("without index", function() {
        it("pops index and pushes from a given segment with index to the stack", function() {
          subject.memory().local[9] =  666;
          subject.stack().push(9);
          subject["PUSH"]("local");
          expect(subject.stack().pop()).to.equal(666);
        });
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
        expect(subject.stack().pop()).to.equal(sum);
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
        expect(subject.stack().pop()).to.equal(product);
      });
    });

    describe("#EQUALS", function() {
      it("pops two values and compares on equality", function() {
        subject.stack().push(3);
        subject.stack().push(3);
        subject["EQUALS"]();
        expect(subject.stack().pop()).to.equal(1);
        subject.stack().push(3);
        subject.stack().push(4);
        subject["EQUALS"]();
        expect(subject.stack().pop()).to.equal(0);
      });
    });

    describe("#ISNOT", function() {
      it("pops two values and compares on equality", function() {
        subject.stack().push(3);
        subject.stack().push(4);
        subject["ISNOT"]();
        expect(subject.stack().pop()).to.equal(1);
        subject.stack().push(3);
        subject.stack().push(3);
        subject["ISNOT"]();
        expect(subject.stack().pop()).to.equal(0);
      });
    });

    describe("#GREATER", function() {
      it("pops two values and compares on equality", function() {
        subject.stack().push(5);
        subject.stack().push(4);
        subject["GREATER"]();
        expect(subject.stack().pop()).to.equal(1);
        subject.stack().push(4);
        subject.stack().push(5);
        subject["GREATER"]();
        expect(subject.stack().pop()).to.equal(0);
      });
    });

    describe("#LOWER", function() {
      it("pops two values and compares on equality", function() {
        subject.stack().push(5);
        subject.stack().push(4);
        subject["LOWER"]();
        expect(subject.stack().pop()).to.equal(0);
        subject.stack().push(4);
        subject.stack().push(5);
        subject["LOWER"]();
        expect(subject.stack().pop()).to.equal(1);
      });
    });

    describe("#POP", function() {
      it("pops index and value and stores it into given segment at given index", function() {
        subject.stack().push(1);
        subject.stack().push(666);
        subject["POP"]("local");
        expect(subject.memory().local[1]).to.equal(666);
      });
    });

    describe("#JUMP_ON_TRUE", function() {
      it("jumps to given label when true popped and continues execution", function() {
        instructions = SimpleScript.createInstructionSet();
        var label = instructions.createLabel();
        instructions.push({instr: [ "PUSH" , "constant", 2 ]});
        instructions.push({instr: [ "PUSH" , "constant", 1 ]});
        instructions.push({instr: [ "JUMP_ON_TRUE" , label, 'f' ]});
        instructions.push({instr: [ "PUSH" , "constant", 1 ]});
        instructions.push({instr: [ "LABEL" , label ]});
        instructions.push({instr: [ "PUSH" , "constant", 2 ]});
        instructions.push({instr: [ "EQUALS" ]});
        subject.load(instructions);
        subject.run();
        expect(subject.stack().pop()).to.equal(1);
      });
    });

    describe("#IF", function() {
      it("moves stackPointer to next ", function() {
      });
    });

    describe("#PRINT", function() {
      it("pops value and invokes print callback with popped value", function() {
        subject.stack().push(666);
        var printCallbackSpy = sinon.spy(subject, 'printCallback');
        subject["PRINT"]();
        expect(printCallbackSpy.calledWith(666)).to.be.true;
      });
    });

    describe("#MALLOC", function() {
      it("allocates memory and pushes adress", function() {
        var instructions  = { malloc: function(size) { return 0;} };
        var instructionsSpy = sinon.spy(instructions, 'malloc');
        subject.load(instructions);
        subject.stack().push(2);
        subject["MALLOC"]("local");
        expect(subject.stack().pop()).to.equal(0);
        expect(instructionsSpy.calledWith(2)).to.be.true;
      });
    });

    describe("#DUP", function() {
      it("pops and duplicates stack item", function() {
        subject.stack().push(2);
        subject["DUP"]();
        expect(subject.stack().pop()).to.equal(2);
        expect(subject.stack().pop()).to.equal(2);
      });
    });

    describe("#READ", function() {
      it("stores value returned by read callback into local segment", function() {
        subject.readCallback = function() { return "abc"; };
        subject.stack().push(2);
        var instructions  = { malloc: function(size) { return 3;} };
        var instructionsSpy = sinon.spy(instructions, 'malloc');
        subject.load(instructions);
        subject["READ"]("local");
        expect(instructionsSpy.calledWith(3)).to.be.true;
        expect(subject.memory().local[2]).to.equal(3);
      });
    });
  });

  describe("instruction set", function() {
    var subject;

    beforeEach(function() {
      subject = SimpleScript.createInstructionSet();
    });

    it("is enumerable", function() {
      expect(subject.each).to.be.defined;
    });

    it("maps variables to indices", function() {
      expect(subject.getIndex("x")).to.equal(0);
      expect(subject.getIndex("y")).to.equal(1);
      expect(subject.getIndex("x")).to.equal(0);
    });

    describe("malloc", function() {
      it("allocates memory", function() {
        expect(subject.getIndex("x")).to.equal(0);
        expect(subject.malloc(4)).to.equal(1);
        expect(subject.getIndex("y")).to.equal(5);
      });
    });
  });
});
