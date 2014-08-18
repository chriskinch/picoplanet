ENGINE.Defences = function(args) {

  _.extend(this, {
    group: 'building',
    x: app.game.inv_defences.x - 10,
    y: app.game.inv_defences.y - 10,
    width: 20,
    height: 20,
    fill: '#999933',
    back: '#555500',
    gather_rate: 1000,
    gather_cooldown: 1000,
    fire_rate: 1000,
    fire_cooldown: {min:400, max:600},
    cost: 20,
    build: 300,
    max_health: 10,
    health: 10,
    constructed: 0,
    snap_to: app.game.world,
    selectable: true,
    draggable: true,
    snappable: true,
    grabbed: true,
    mouseover: true,
  }, args);

  this.laser = {
    color: '#5555ff',
  }

};

ENGINE.Defences.prototype = {
  construct: function(delta) {
    app.game.credit -= this.cost;
    this.cost = 0;
    if(this.constructed < this.build) {
      this.constructed += 1;
    }
    var build_percent = this.constructed/this.build * 100;

    if(build_percent >= 100) {
      this.built = true;
    }
  },

  gather: function(delta) {
    this.gather_rate -= delta;
    if(this.gather_rate <= 0 && app.game.defence < app.game.buildings.defences) {
      app.game.defence++;
      this.gather_rate = this.gather_cooldown;
    }
  },

  fire: function() {
    this.collection.add(ENGINE.Laser, {
      x: this.x,
      y: this.y,
      start: { x:this.x, y:this.y },
      target: this.target,  
      color: this.laser.color,
    });
  },

  targetUnit: function() {
    var enemies = app.game.entities.group('group', 'enemy');
    var targets = app.game.entities.filter('orbiting', true, enemies);
    if(targets.length > 0) {
      var index = Math.floor( Math.random()*(targets.length) );
      return targets[index];
    }
  },

  step: function(delta) {
    if(!this.built && this.snapped) this.construct(delta);

    if(this.built) this.gather(delta);

    if(this.built && app.game.enemies.count > 0) {
      this.fire_rate -= delta;
      if(this.fire_rate <= 0) {
        this.target = this.targetUnit();
        if(this.target) {
          this.fire();
        }
        this.fire_rate = utils.getRandomArbitrary(this.fire_cooldown.min, this.fire_cooldown.max);
      }
    }

    this.health_percent = this.health/this.max_health;
    if(this.health <= 0) this.remove();
  },

  render: function(delta) {
    app.layer
      .save()
      .translate(this.x, this.y)
      .rotate(Math.PI/180 * 180)
      .fillStyle(this.back)
      .fillRect(-this.width/2, -this.height/2, this.width, this.height)
      .restore();

    app.layer
      .save()
      .translate(this.x, this.y)
      .rotate(Math.PI/180 * 180)
      .fillStyle(this.fill)
      .fillRect(-this.width/2, -this.height/2, this.width, this.height * this.health_percent)
      .restore();

    // app.layer
    //   .fillStyle('#fff')
    //   .closedcircle(this.x, this.y, 1)
    //   .fill();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;

    app.game.buildings.count--;
    app.game.buildings.defences--;
  }
};