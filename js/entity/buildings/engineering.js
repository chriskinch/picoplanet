ENGINE.Engineering = function(args) {

  _.extend(this, {
    type: 'engineering',
    resource: 'engineers',
    counter: {
      cap: 3,
    },
    colour: {
      fill: '#339933',
      back: '#005500',
    },
  }, args);

  this.physics = new ENGINE.Physics(this);

};

ENGINE.Engineering.prototype = {

  repair: function() {
    if(this.state.built) {
      var buildings = _.where(app.game.entities, {group: 'building'});
      var damaged = _.filterByPath(buildings, 'state.damaged');
      var capped = damaged.splice(0, this.counter.cap);

      _.each(capped, function(building, index){
        building.counter.health += 0.5;
        app.game.credit -= 0.25;
      });
      
    }
  },

  step: function(delta) {
    this.physics.step(delta);

    this.timer.rate -= delta;
    if(this.timer.rate <= 0) {
      this.repair();
      this.timer.rate = this.timer.cooldown;
    }
  },

  render: function(delta) {
    this.physics.render(delta);
  },

  remove: function() {
    this.physics.remove();
  }
};
