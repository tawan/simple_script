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
        it("pushes its assigned value", function() {
          ident.visit(programm);
          expect(programm.pop().instr).to.deep.equal([ "PUSH", "local", 0 ]);
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
    });

    describe("Assignment", function() {
      var assignment, ident, expr;
      var name = "x";

      beforeEach(function() {
        expr = { visit: function(programm) {} };
        exprSpy = sinon.spy(expr, "visit");
        ident = { name: function() { return name; } };
        assignment = SimpleScript.treeFactory.createNode({ type: "assignment", children: [ ident, expr ]});
      });

      describe("#visit", function() {
        beforeEach(function() { assignment.visit(programm); });

        it("visits its expression", function() {
          expect(exprSpy.calledWith(programm)).to.be.true;
        });

        it("instructs to pop the stacked value into the local segment with the correct index", function() {
          expect(programm.pop().instr).to.deep.equal(["POP", "local", 0]);
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
