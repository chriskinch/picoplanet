ENGINE.Factory = function(args) {

  _.extend(this, {
    type: 'factory',
    resource: 'power',
    counter: {
      cap: 10,
    },
    colour: {
      fill: '#333399',
      back: '#000055',
    },
  }, args);

  this.physics = new ENGINE.Physics(this);
};

ENGINE.Factory.prototype = {

  step: function(delta) {
    this.physics.step(delta);
  },
  
  render: function(delta) {
    this.physics.render(delta);

    this.timer.rate -= delta;
    if(this.timer.rate <= 0 && this.state.built) {
      app.game.credit++;
      this.timer.rate = this.timer.cooldown;
    }
  },

  remove: function() {
    this.physics.remove();
  }
};
