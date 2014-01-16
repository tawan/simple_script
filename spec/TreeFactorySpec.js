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

      it("is a node", function() {
        expect(subject.isNode).toBe(true);
      });

      it("has a line number", function() {
        var node = SimpleScript.treeFactory.createNode({ line: 44 });
        expect(node.line()).toBe(44);
      });

      describe("constructor", function() {
        it("children property of given argument become nodes children", function() {
          var first_child = SimpleScript.treeFactory.createNode();
          var second_child = SimpleScript.treeFactory.createNode();
          subject = SimpleScript.treeFactory.createNode({ children: [ first_child, second_child ] });
          expect(subject.children()[0]).toBe(first_child);
          expect(subject.children()[1]).toBe(second_child);
          expect(subject.children()[2]).toBeUndefined();
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
          expect(programm.pop()).toEqual([ "PUSH", "constant", nativeValue ]);
        });
      });
    });


    describe("Ident", function() {
      var ident;
      var name = "x";
      beforeEach(function() { ident = SimpleScript.treeFactory.createNode({ type: "ident", value: name }); });


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
        left = jasmine.createSpyObj("left", [ "visit", "isNode" ]);
        right = jasmine.createSpyObj("right", [ "visit", "isNode" ]);
        addition = SimpleScript.treeFactory.createNode({ type: "addition", children: [ left, right ] });
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
        addition = SimpleScript.treeFactory.createNode({ type: "multiplication", children: [ left, right ] });
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
        assignment = SimpleScript.treeFactory.createNode({ type: "assignment", children: [ ident, expr ]});
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
        expect(node.passed).toBeUndefined();
        node.passed = true
      });

      expect(tree.passed).toBe(true);
      expect(child_1.passed).toBe(true);
      expect(child_2.passed).toBe(true);
    });
  });
});
