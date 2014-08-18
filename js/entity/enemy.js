ENGINE.Enemy = function(args) {

  var radius = app.game.world.radius,
      atmos = Math.sqrt(radius*radius + radius*radius),
      orbit = atmos + utils.getRandomInt(80, 150),
      spawn = { x:app.width/2, y: app.height + 30 };

  _.extend(this, {
    group: 'enemy',
    x: spawn.x,
    y: spawn.y,
    start: spawn,
    orbit: orbit,
    world: app.game.world,
    width: 20,
    height: 20,
    selectable: true,
    fire_rate: 100,
    cooldown: {min:900, max:1100},
    path: 0,
    speed: utils.getRandomArbitrary(0.5, 1),
    health: 5,
  }, args);

  this.laser = {
    color: '#ff5555',
  }

};

ENGINE.Enemy.prototype = {

  followPath: function(delta) {
    if(this.orbiting) {
      this.path -= (this.speed*45) * delta / 1000;
      if(this.path <= 0) this.path = 360;
      var angle = (this.path) * (Math.PI/180);
      var x = Math.cos(angle) * this.orbit;
      var y = Math.sin(angle) * this.orbit;
      this.x = this.world.x + x;
      this.y = this.world.y + y;
    }else{
      this.path += this.speed * delta / 4000;
      var xy = utils.getQuadraticBezierXYatPercent(
        {x:this.start.x, y:this.start.y},
        {x:this.start.x+this.orbit, y:this.start.y},
        {x:this.world.x+this.orbit, y:this.world.y},
        this.path
      );
      this.x = xy.x;
      this.y = xy.y;
      if(this.path >= 1) {
        this.path = 360;
        this.orbiting = true;
      }
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
    var buildings = app.game.entities.group('group', 'building');
    var targets = app.game.entities.filter('built', true, buildings);
    if(targets.length > 0) {
      var index = Math.floor( Math.random()*(targets.length) );
      return targets[index];
    }
  },

  step: function(delta) {
    this.followPath(delta);
    if(this.orbiting && app.game.buildings.count > 0) {
      this.fire_rate -= delta;
      if(this.fire_rate <= 0) {
        this.target = this.targetUnit();
        if(this.target) {
          this.fire();
        }
        this.fire_rate = utils.getRandomArbitrary(this.cooldown.min, this.cooldown.max);
      }
    }

    if(this.health <= 0) this.remove();
  },

  render: function(delta) {
    
    // app.layer
    //   .moveTo(this.start.x, this.start.y)
    //   .quadraticCurveTo(this.start.x+this.orbit, this.start.y, this.world.x+this.orbit, this.world.y)
    //   .lineWidth(1)
    //   .strokeStyle('rgba(255,255,255,0.1)')
    //   .stroke()

    //   .beginPath()
    //   .arc(this.world.x,this.world.y,this.orbit,0,2*Math.PI,true)
    //   .closePath()
    //   .lineWidth(1)
    //   .strokeStyle('rgba(255,255,255,0.1)')
    //   .stroke();
    

    app.layer
      .fillStyle('rgba(255,255,255,1)')
      .closedcircle(this.x, this.y, 7)
      .fill();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;

    app.game.enemies.count--;
  }
};
