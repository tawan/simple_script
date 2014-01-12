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
          expect(programm.pop()).toEqual([ "PUSH", "constant", nativeValue ]);
        });
      });
    });


    describe("Ident", function() {
      var ident;
      var name = "x";
      beforeEach(function() { ident = SimpleScript.treeFactory.createIdent(name); });


      describe("#name", function() {
        it("returns its name", function() {
          expect(ident.name()).toEqual(name);
        });
      });

      describe("#visit", function() {
        it("pushes its assigned value", function() {
          ident.visit(programm);
          expect(programm.pop()).toEqual([ "PUSH", "local", 0 ]);
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

    describe("Assignment", function() {
      var assignment, ident, expr;
      var name = "x";

      beforeEach(function() {
        ident = { name: function() { return name; } };
        expr = jasmine.createSpyObj("expr", [ "visit" ]);
        assignment = SimpleScript.treeFactory.createAssignment(ident, expr);
      });

      describe("#visit", function() {
        beforeEach(function() { assignment.visit(programm); });

        it("visits its expression", function() {
          expect(expr.visit).toHaveBeenCalledWith(programm);
        });

        it("instructs to pop the stacked value into the local segment with the correct index", function() {
          expect(programm.pop()).toEqual(["POP", "local", 0]);
        });
      });
    });
  });

  describe("treeWalker", function() {
    var subject;
    var tree;
    var children;

    beforeEach(function() {
      children = SimpleScript.createEnumerable();
      children.push(SimpleScript.treeFactory.createNode());
      children.push(SimpleScript.treeFactory.createNode());
      tree = SimpleScript.treeFactory.createNode(children);
      subject = SimpleScript.createTreeWalker(tree);
    });

    it("should itereate over each node", function() {
      subject.each(function(node) {
        expect(node.passed).toBeUndefined();
        node.passed = true
      });

      expect(tree.passed).toBe(true);
      children.each(function(child) {
        expect(child.passed).toBe(true);
      });
    });
  });
});
