describe("SimpleScript", function() {
  var programm;

  beforeEach(function() {
    programm = [];
  });

  describe("virtual machine", function() {
    var subject, instruction_1, instruction_2, instructions;

    beforeEach(function() {
      subject = SimpleScript.createVM();
      instruction_1 = [ "PUSH" , 2 ];
      instruction_2 = [ "ADD" ]
      instructions = SimpleScript.createEnumerable();
      instructions.push(instruction_1);
      instructions.push(instruction_2);
    });

    describe("#execute", function() {
      beforeEach(function() {
        spyOn(subject, "PUSH").and.callThrough();
        spyOn(subject, "ADD").and.callThrough();
        subject.execute(instructions);
      });

      it("executes each instruction", function() {
        expect(subject["PUSH"]).toHaveBeenCalledWith(2);
        expect(subject["ADD"]).toHaveBeenCalled();
      });
    });

    describe("#PUSH", function() {
      it("pushes a value to the stack", function() {
        subject["PUSH"](666);
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
  });
});
