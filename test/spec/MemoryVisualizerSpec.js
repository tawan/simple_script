describe("SimpleScript", function() {
  describe("MemoryVisualizer", function() {
    var subject;

    beforeEach(function() {
      subject = SimpleScript.createMemoryVisualizer(
        {},
        { registerObserver: function(){}}
      ); 
    });

    it("has a default min size", function() {
      expect(subject.options.minSize).to.equal(10);
    });

    it("registers as observer", function() {
      var memory = { registerObserver: function(observer) {} };
      var memorySpy = sinon.spy(memory, 'registerObserver');
      subject =  SimpleScript.createMemoryVisualizer({}, memory, {});
      expect(memorySpy.calledWith(subject)).to.be.true;
    });


    describe("#notify", function() {
      it("delegates to target", function() {
        subject.dummyAction = function(param1, param2, param3) {};
        var targetSpy = sinon.spy(subject, "dummyAction");
        subject.notify("dummyAction", 1, 2, 3);
        expect(targetSpy.calledWith(1, 2, 3)).to.be.true;
      });
    });

    describe("#render", function() {
      it("renders memory template", function() {
        var parentElement = { html: function(content) {} };
        var parentElementSpy = sinon.spy(parentElement, 'html');
        subject.render(parentElement);
        expectedContent = SimpleScript.Templates.memory({memory: subject.memory});
        expect(parentElementSpy.calledWith(expectedContent)).to.be.true;
      });
    });
  });
});
