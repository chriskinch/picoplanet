ENGINE.Lab = function(args) {

  _.extend(this, {
    type: 'lab',
    resource: 'tech',
    counter: {
      cap: 1,
    },
    colour: {
      fill: '#993333',
      back: '#550000',
    },
  }, args);

  this.physics = new ENGINE.Physics(this);
};

ENGINE.Lab.prototype = {

  step: function(delta) {
    this.physics.step(delta);
  },

  render: function(delta) {
    this.physics.render(delta);
  },

  remove: function() {
    this.physics.remove();
  }
};
