var SimpleScript = {};

SimpleScript.nodeFactory = {

  createNode: function() {
    var children = [];

    return {
      children: function() { return children; },
        addChild: function(childNode) {
          children.push(childNode);
        },
    }
  },

  createIdentifier: function(name) {
    var identifier =  this.createNode();
    identifier.name = function() {
      return name;
    }

    return identifier;
  },

  createNumber: function(number) {
    var node =  this.createExpression();
    node.result = function() {
      return Number(number);
    }

    return node;
  },

  createExpression: function() {
    var node = this.createNode();

    node.result = function() {
      return 0;
    }

    return node;
  },

  createAddition: function(children) {
    var addition = this.createExpression();
    addition.left = function() {
      return children.left;
    }

    addition.right = function() {
      return children.right;
    }

    addition.result = function() {
      return addition.left().result() + addition.right().result();
    }

    return addition;
  },

  createAssignment: function(children) {
    var assignment = this.createNode();
    assignment.identifier = function() {
      return children.identifier;
    }

    assignment.expression = function() {
      return children.expression;
    }
    return assignment;
  }
}
