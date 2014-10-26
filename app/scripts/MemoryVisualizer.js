var SimpleScript = (function(my) {
  my.createMemoryVisualizer = function(parentElement, vmMemory, options) {
    var defaultOptions = {
      minSize: 10
    };

    var newOptions = jQuery.extend({}, defaultOptions, options || {});
    var memory = [];
    for (var i = 0; i < newOptions.minSize; i++) {
      memory.push(null);
    };

    var instance =  {
      notify: function(action) {
        var newArgsList = [];
        for (var i = 1; i < arguments.length; i++) {
          newArgsList.push(arguments[i]);
        };
        this[action].apply(this, newArgsList);
      },

      memory: (function() { return memory; })(),

      render: function(parentElement) {
        parentElement.html(SimpleScript.Templates.memory({memory: this.memory})); 
      },
      
      options: (function() {
        return newOptions;
      })()
    };

    vmMemory.registerObserver(instance);
    return instance;
  };
  return my;
})(SimpleScript || {});
