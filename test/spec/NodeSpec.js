describe("SimpleScript", function() {
  describe("nodes", function() {
    var subject;

    beforeEach(function() {
      subject = new SimpleScript.Node();
    });

    it("can evaluate", function() {
      expect(subject.eval()).toBe(null);
    });

    it("can memoize the result", function() {
      expect(subject.result()).toBe(undefined);
      var result = subject.eval();
      expect(subject.result()).toBe(result);
    });

    describe("eval", function() {
      it("returns the memoized result if there is any", function() {
        expect(subject.result()).toBe(undefined);
        expect(subject.eval()).toBe(null);
        subject.result = function() { return "something" };
        expect(subject.eval()).toEqual("something");
      });
    });

    describe("Number", function() {
      it("evals to native number", function() {
        var number  = new SimpleScript.Number("4");
        expect(number.eval()).toBe(4);
      });
    });

    describe("Addition", function() {
      it("can add the result of two nodes", function() {
        var left = new SimpleScript.Number(3);
        var right = new SimpleScript.Number(4);
        var sum = left.eval() + right.eval();
        var addition = new SimpleScript.Addition(left, right);
        expect(addition.eval()).toBe(sum);
      });
    });
  });

  describe("debugger", function() {

  });
});
