ENGINE.Defences = function(args) {
  
  _.extend(this, {
    type: 'defences',
    resource: 'defence',
    counter: {
      cap: 1,
    },
    colour: {
      fill: '#999933',
      back: '#555500',
    },
    laser: {
      color: '#5555ff',
      rate: 1000,
      cooldown: {min:800, max:1000},
    },
  }, args);

  this.physics = new ENGINE.Physics(this);

};

ENGINE.Defences.prototype = {

  fire: function() {
    this.collection.add(ENGINE.Laser, {
      x: this.x,
      y: this.y,
      start: { x:this.x, y:this.y },
      target: this.target,  
      color: this.laser.color,
    });
  },

  targets: function() {
    var enemies = _.where(app.game.entities, {group: 'enemy'});
    var targets = _.filterByPath(enemies, 'state.orbiting');
    if(targets.length > 0) {
      var index = Math.floor( Math.random()*(targets.length) );
      return targets[index];
    }
  },

  step: function(delta) {
    this.physics.step(delta);
    if(this.state.built && app.game.enemies.count > 0) {
      this.laser.rate -= delta;
      if(this.laser.rate <= 0) {
        this.target = this.targets();
        if(this.target) {
          this.fire();
        }
        this.laser.rate = utils.getRandomArbitrary(this.laser.cooldown.min, this.laser.cooldown.max);
      }
    }
  },

  render: function(delta) {
    this.physics.render(delta);
  },

  remove: function() {
    this.physics.remove();
  }
};
