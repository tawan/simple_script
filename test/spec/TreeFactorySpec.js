describe("SimpleScript", function() {
  var programm;

  beforeEach(function() {
    programm = SimpleScript.createInstructionSet();
  });

  describe("treeFactory", function() {
    describe("Node", function() {
      var subject;
      beforeEach(function() { subject = SimpleScript.treeFactory.createNode(); });

      it("has children", function() {
        expect(subject.children().each).to.a('function');
      });

      it("has a line number", function() {
        var node = SimpleScript.treeFactory.createNode({ line: 44 });
        expect(node.line()).to.equal(44);
      });

      it("has a first column", function() {
        var node = SimpleScript.treeFactory.createNode({ firstColumn: 1 });
        expect(node.firstColumn()).to.equal(1);
      });

      it("has a last column", function() {
        var node = SimpleScript.treeFactory.createNode({ lastColumn: 1 });
        expect(node.lastColumn()).to.equal(1);
      });

      describe("constructor", function() {
        it("children property of given argument become nodes children", function() {
          var first_child = SimpleScript.treeFactory.createNode();
          var second_child = SimpleScript.treeFactory.createNode();
          subject = SimpleScript.treeFactory.createNode({ children: [ first_child, second_child ] });
          expect(subject.children()[0]).to.equal(first_child);
          expect(subject.children()[1]).to.equal(second_child);
          expect(subject.children()[2]).to.be.undefined;
        });
      });
    });

    describe("Number", function() {
      var number;
      var value = "4";
      var nativeValue = Number(value);

      beforeEach(function() {
        number = SimpleScript.treeFactory.createNode({ type: "number", value: value });
      });

      describe("#visit", function() {
        it("pushes its native value", function() {
          number.visit(programm);
          expect(programm.pop().instr).to.deep.equal([ "PUSH", "constant", nativeValue ]);
        });
      });
    });

    describe("Char", function() {
      var _char;
      var value = "a";
      var nativeValue = value.charCodeAt(0);

      beforeEach(function() {
        number = SimpleScript.treeFactory.createNode({ type: "_char", value: value });
      });

      describe("#visit", function() {
        it("pushes its ASCII code", function() {
          number.visit(programm);
          expect(programm.pop().instr).to.deep.equal([ "PUSH", "constant", nativeValue ]);
        });
      });
    });

    describe("String", function() {
      var string, firstChar, secondChar, firstCharSpy, secondCharSpy;

      beforeEach(function() {
        firstChar = { visit: function(programm) {} };
        secondChar = { visit: function(programm) {} };
        firstCharSpy = sinon.spy(firstChar, "visit");
        secondCharSpy = sinon.spy(secondChar, "visit");
        string = SimpleScript.treeFactory.createNode({ type: "string", children: [ firstChar, secondChar ]});
      });

      describe("#visit", function() {
          beforeEach(function() { string.visit(programm); });

          it("visits its children", function() {
            expect(secondCharSpy.calledWith(programm)).to.be.true;
            expect(firstCharSpy.calledWith(programm)).to.be.true;
          });

          it("instructs to allocate memory for chars", function() {
            expect(programm.pop().instr).to.deep.equal([ "POP", "local"]);
            expect(programm.pop().instr).to.deep.equal([ "ADD"]);
            expect(programm.pop().instr).to.deep.equal([ "PUSH", "constant", 1]);
            expect(programm.pop().instr).to.deep.equal([ "DUP"]);
            expect(programm.pop().instr).to.deep.equal([ "POP", "local"]);
            expect(programm.pop().instr).to.deep.equal([ "ADD"]);
            expect(programm.pop().instr).to.deep.equal([ "PUSH", "constant", 0]);
            expect(programm.pop().instr).to.deep.equal([ "DUP"]);
            expect(programm.pop().instr).to.deep.equal([ "MALLOC", "local"]);
            expect(programm.pop().instr).to.deep.equal([ "PUSH", "constant", 2]);
          });
      });
    });

    describe("Ident", function() {
      var ident;
      var name = "x";
      beforeEach(function() { ident = SimpleScript.treeFactory.createNode({ type: "ident", value: name }); });


      describe("#name", function() {
        it("returns its name", function() {
          expect(ident.name()).to.equal(name);
        });
      });

      describe("#visit", function() {
        it("pushes its index and assigned value", function() {
          ident.visit(programm);
          expect(programm.pop().instr).to.deep.equal([ "PUSH", "local"]);
          expect(programm.pop().instr).to.deep.equal([ "PUSH", "constant", 0]);
        });
      });

      describe("Ident with accessor", function() {
        var ident, exp, expSpy;
        var name = "x";
        beforeEach(function() { 
          exp = { visit: function() {} };
          expSpy = sinon.spy(exp, 'visit');
          ident = SimpleScript.treeFactory.createNode({ type: "ident_with_acc", value: name, children: [ exp ] }); 
        });


        describe("#name", function() {
          it("returns its name", function() {
            expect(ident.name()).to.equal(name);
          });
        });

        describe("#visit", function() {
          beforeEach(function() {ident.visit(programm); });

          it("visits its children", function() {
            expect(expSpy.calledWith(programm)).to.be.true;
          });

          it("adds index and pushes its assigned value", function() {
            ident.visit(programm);
            expect(programm.pop().instr).to.deep.equal([ "PUSH", "local"]);
            expect(programm.pop().instr).to.deep.equal([ "ADD" ]);
            expect(programm.pop().instr).to.deep.equal([ "PUSH", "local", 0]);
          });
        });
      });
    });

    describe("Adress", function() {
      var adress;
      var name = "x";
      beforeEach(function() { adress = SimpleScript.treeFactory.createNode({ type: "adress", value: name }); });


      describe("#name", function() {
        it("returns its name", function() {
          expect(adress.name()).to.equal(name);
        });
      });

      describe("#visit", function() {
        it("pushes its assigned adress", function() {
          adress.visit(programm);
          expect(programm.pop().instr).to.deep.equal([ "PUSH", "constant", 0 ]);
        });
      });

      describe("Adress with accessor", function() {
        var adress, exp, expSpy;
        var name = "x";
        beforeEach(function() { 
          exp = { visit: function() {} };
          expSpy = sinon.spy(exp, 'visit');
          adress = SimpleScript.treeFactory.createNode({ type: "adress_with_acc", value: name, children: [ exp] });
        });


        describe("#name", function() {
          it("returns its name", function() {
            expect(adress.name()).to.equal(name);
          });
        });

        describe("#visit", function() {
          beforeEach(function() {adress.visit(programm); });

          it("visits its children", function() {
            expect(expSpy.calledWith(programm)).to.be.true;
          });

          it("pushes its assigned adress and adds", function() {
            adress.visit(programm);
            expect(programm.pop().instr).to.deep.equal([ "ADD" ]);
            expect(programm.pop().instr).to.deep.equal([ "PUSH", "local", 0 ]);
          });
        });
      });
    });

    describe("Binary operation", function() {
      var left, right, leftSpy, rightSpy;

      beforeEach(function() {
        left = { visit: function(programm) {} };
        right = { visit: function(programm) {} };
        leftSpy = sinon.spy(left, "visit");
        rightSpy = sinon.spy(right, "visit");
      });

      describe("Addition", function() {
        var addition;

        beforeEach(function() {
          addition = SimpleScript.treeFactory.createNode({ type: "addition", children: [ left, right ] });
        });

        describe("#visit", function() {
          beforeEach(function() { addition.visit(programm); });

          it("visits its children", function() {
            expect(leftSpy.calledWith(programm)).to.be.true;
            expect(rightSpy.calledWith(programm)).to.be.true;
          });

          it("instructs to add", function() {
            expect(programm.pop().instr).to.deep.equal([ "ADD" ]);
          });
        });
      });

      describe("Multiplication", function() {
        var multiplication;

        beforeEach(function() {
          multiplication = SimpleScript.treeFactory.createNode({ type: "multiplication", children: [ left, right ] });
        });

        describe("#visit", function() {
          beforeEach(function() { multiplication.visit(programm); });

          it("visits its children", function() {
            expect(leftSpy.calledWith(programm)).to.be.true;
            expect(rightSpy.calledWith(programm)).to.be.true;
          });

          it("instructs to multiply", function() {
            expect(programm.pop().instr).to.deep.equal([ "MUL" ]);
          });
        });
      });

      describe("greater", function() {
        var greater;

        beforeEach(function() {
          greater = SimpleScript.treeFactory.createNode({ type: "greater", children: [ left, right ] });
        });

        describe("#visit", function() {
          beforeEach(function() { greater.visit(programm); });

          it("visits its children", function() {
            expect(leftSpy.calledWith(programm)).to.be.true;
            expect(rightSpy.calledWith(programm)).to.be.true;
          });

          it("compares with greater", function() {
            expect(programm.pop().instr).to.deep.equal([ "GREATER" ]);
          });
        });
      });

      describe("lower", function() {
        var lower;

        beforeEach(function() {
          lower = SimpleScript.treeFactory.createNode({ type: "lower", children: [ left, right ] });
        });

        describe("#visit", function() {
          beforeEach(function() { lower.visit(programm); });

          it("visits its children", function() {
            expect(leftSpy.calledWith(programm)).to.be.true;
            expect(rightSpy.calledWith(programm)).to.be.true;
          });

          it("compares with lower", function() {
            expect(programm.pop().instr).to.deep.equal([ "LOWER" ]);
          });
        });
      });

      describe("equals", function() {
        var equals;

        beforeEach(function() {
          equals = SimpleScript.treeFactory.createNode({ type: "equals", children: [ left, right ] });
        });

        describe("#visit", function() {
          beforeEach(function() { equals.visit(programm); });

          it("visits its children", function() {
            expect(leftSpy.calledWith(programm)).to.be.true;
            expect(rightSpy.calledWith(programm)).to.be.true;
          });

          it("compares with equals", function() {
            expect(programm.pop().instr).to.deep.equal([ "EQUALS" ]);
          });
        });
      });

      describe("isnot", function() {
        var isnot;

        beforeEach(function() {
          isnot = SimpleScript.treeFactory.createNode({ type: "isnot", children: [ left, right ] });
        });

        describe("#visit", function() {
          beforeEach(function() { isnot.visit(programm); });

          it("visits its children", function() {
            expect(leftSpy.calledWith(programm)).to.be.true;
            expect(rightSpy.calledWith(programm)).to.be.true;
          });

          it("compares with isnot", function() {
            expect(programm.pop().instr).to.deep.equal([ "ISNOT" ]);
          });
        });
      });
    });

    describe("Assignment", function() {
      var assignment, ident, expr;
      var name = "x";

      beforeEach(function() {
        expr = { visit: function(programm) {} };
        exprSpy = sinon.spy(expr, "visit");
        ident = { visit: function(programm) { } };
        assignment = SimpleScript.treeFactory.createNode({ type: "assignment", children: [ ident, expr ]});
      });

      describe("#visit", function() {
        beforeEach(function() { assignment.visit(programm); });

        it("visits its expression", function() {
          expect(exprSpy.calledWith(programm)).to.be.true;
        });

        it("instructs to pop the stacked value into the local segment with the correct index", function() {
          expect(programm.pop().instr).to.deep.equal(["POP", "local"]);
        });
      });
    });

    describe("Read", function() {
      var read, adress;
      var name = "x";

      beforeEach(function() {
        adress = { visit: function() { return 0; } };
        read = SimpleScript.treeFactory.createNode({ type: "read", children: [ adress ]});
      });

      describe("#visit", function() {
        beforeEach(function() { read.visit(programm); });

        it("instructs to read into the local segment with the correct index", function() {
          expect(programm.pop().instr).to.deep.equal(["READ", "local"]);
        });
      });
    });

    describe("Print", function() {
      var print, expr;

      beforeEach(function() {
        expr = { visit: function(programm) {} };
        exprSpy = sinon.spy(expr, "visit");
        print = SimpleScript.treeFactory.createNode({ type: "print", children: [ expr ]});
      });

      describe("#visit", function() {
        beforeEach(function() { print.visit(programm); });

        it("visits its expression", function() {
          expect(exprSpy.calledWith(programm)).to.be.true;
        });

        it("instructs to print the stacked value", function() {
          expect(programm.pop().instr).to.deep.equal(["PRINT"]);
        });
      });
    });

    describe("while loop", function() {
      var whileLoop, condition, block;

      beforeEach(function() {
        condition = { visit: function(programm) {} };
        block = { visit: function(programm) {} };
        conditionSpy = sinon.spy(condition, "visit");
        blockSpy = sinon.spy(block, "visit");
        whileLoop = SimpleScript.treeFactory.createNode({ type: "whileLoop", children: [ condition, block ]});
      });

      describe("#visit", function() {
        beforeEach(function() {whileLoop.visit(programm); });

        it("visits its condition", function() {
          expect(conditionSpy.calledWith(programm)).to.be.true;
        });

        it("visits its block", function() {
          expect(blockSpy.calledWith(programm)).to.be.true;
        });
      });
    });

    describe("array", function() {
      var arr, exp, expSpy;

      beforeEach(function() {
        exp = { visit: function(programm) {} };
        expSpy = sinon.spy(exp, "visit");
        arr = SimpleScript.treeFactory.createNode({ type: "array", children: [ exp ]});
      });

      describe("#visit", function() {
        beforeEach(function() {arr.visit(programm); });

        it("visits its condition", function() {
          expect(expSpy.calledWith(programm)).to.be.true;
        });

        it("allocates local memory", function() {
          expect(programm.pop().instr).to.deep.equal(["MALLOC", "local"]);
        });
      });
    });
  });

  describe("treeWalker", function() {
    var subject;
    var tree;
    var children;
    var child_1;
    var child_2;

    beforeEach(function() {
      child_1 = SimpleScript.treeFactory.createNode() ;
      child_2 = SimpleScript.treeFactory.createNode() ;
      tree = SimpleScript.treeFactory.createNode({ children: [ child_1, child_2 ] });
      subject = SimpleScript.createTreeWalker(tree);
    });

    it("should itereate over each node", function() {
      subject.each(function(node) {
        expect(node.passed).to.be.undefined;
        node.passed = true
      });

      expect(tree.passed).to.be.true;
      expect(child_1.passed).to.be.true;
      expect(child_2.passed).to.be.true;
    });
  });
});
