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

    describe("Number", function() {
      it("evals to native number", function() {
        var number  = new SimpleScript.NumberNode("4");
        expect(number.eval()).toBe(4);
      });
    });
  });
});
