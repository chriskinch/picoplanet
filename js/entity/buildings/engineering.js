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
    if(this.state.built && app.game.credit > 0) {
      var buildings = _.where(app.game.entities, {group: 'building'});
      var damaged = _.filterByPath(buildings, 'state.damaged');
      this.targets = damaged.splice(0, this.counter.cap);

      _.each(this.targets, function(building, index){
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

    var world = app.game.world;
    var rand = utils.getRandomArbitrary;

    if(this.targets && this.targets.length > 0 && app.game.credit) {
      for(var i=0; i<this.targets.length; i++){
        if(this.targets[i] !== this) {
          app.layer
            .save()
            .beginPath()
            .moveTo(this.targets[i].x, this.targets[i].y)
            .bezierCurveTo(world.x + rand(-2, 2), world.y + rand(-2, 2), world.x + rand(-2, 2), world.y + rand(-2, 2), this.x, this.y)
            .strokeStyle('rgba(0,0,0,0.2)')
            .stroke()
            .restore();
        }
      }
    }
  },

  remove: function() {
    this.physics.remove();
  }
};
