describe("SimpleScript AST nodes", function() {
  var factory = SimpleScript.nodeFactory;

  describe("An identifier", function() {
    var identifier = factory.createIdentifier("x");

    it("is a leaf node", function() {
      expect(identifier.children()).toEqual([]);
    });

    it("has a name", function() {
      expect(identifier.name()).toEqual("x");
    });
  });

  describe("An expression", function() {
    it("has a result", function() {
      var expression = factory.createExpression();
      expect(expression.result()).toBe(0);
    });

    describe("An additon", function() {
      it("has an expression the left side", function() {
        var left = jasmine.createSpy();
        var additon = factory.createAddition({ left: left });
        expect(additon.left()).toBe(left);
      });

      it("has an expression the right side", function() {
        var right = jasmine.createSpy();
        var additon = factory.createAddition({ right: right });
        expect(additon.right()).toBe(right);
      });

      describe("'s result", function() {
        var left = { result: function() { return 4; } };
        var right = { result: function() { return 5; } };
        var expectedResult = 9;

        it("is the addition of the left and right expression", function() {
          var addition = factory.createAddition({ left: left, right: right })
          expect(addition.result()).toBe(expectedResult);
        });
      });
    });

    describe("A number", function() {
      var number = factory.createNumber("6");

      it("is a leaf node", function() {
        expect(number.children()).toEqual([]);
      });

      it("'s result is a native number", function() {
        expect(number.result()).toBe(6);
      });
    });
  });

  describe("An assignment", function() {
    it("has an identifier on the left side", function() {
      var identifier = jasmine.createSpy();
      var assignment = factory.createAssignment({ identifier: identifier });
      expect(assignment.identifier()).toBe(identifier);
    });

    it("has an expression on the right side", function() {
      var expression = jasmine.createSpy();
      var assignment = factory.createAssignment({ expression: expression });
      expect(assignment.expression()).toBe(expression);
    });
  });
});
