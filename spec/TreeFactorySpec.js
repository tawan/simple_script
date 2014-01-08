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
});
