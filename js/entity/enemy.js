ENGINE.Enemy = function(args) {

  var radius = app.game.world.radius;
  var atmos = Math.sqrt(radius*radius + radius*radius);

  _.extend(this, {
    unitx: app.width/2,
    unity: app.height + 30,
    radius: radius,
    orbit: atmos + 30,
    x: app.game.world.x,
    y: app.game.world.y,
    waypoints: [],
    width: 20,
    height: 20,
    selectable: true,
    states:[],
    rate: 1000,
    cooldown: 1000,
    path: 0,
    speed: 50,
  }, args);

};

ENGINE.Enemy.prototype = {

  followPath: function(delta) {
    if(utils.hasArrayItem(this.states, 'orbiting')) {
      this.path -= this.speed * delta / 1000;
      if(this.path <= 0) this.path = 360;
      var angle = (this.path) * (Math.PI/180);
      var x = Math.cos(angle) * this.orbit;
      var y = Math.sin(angle) * this.orbit;
      this.unitx = this.x + x;
      this.unity = this.y + y;
    }else{
      this.path += delta / 4000;
      var xy = utils.getQuadraticBezierXYatPercent(
        {x:app.width/2, y:app.height + 30},
        {x:this.x+this.orbit, y:app.height + 30},
        {x:this.x+this.orbit, y:this.y},
        this.path
      );
      this.unitx = xy.x;
      this.unity = xy.y;
      if(this.path >= 1) {
        this.path = 360;
        utils.setArrayItem(this.states, 'orbiting', true);
      }
    }
  },

  fire: function() {
      this.collection.add(ENGINE.Laser, {
        //direction: this.direction + spreadStart + i * spreadStep,
        x: this.unitx,
        y: this.unity,
        start: { x:this.unitx, y:this.unity },
        end: { x:this.target.x, y:this.target.y },    
        //color: this.weapon.color,
        //shape: this.weapon.shape,
        //speed: this.weapon.speed
      });
  },

  targetUnit: function() {   
    if(app.game.buildings.length > 0) {
      var index = Math.floor( Math.random()*(app.game.buildings.length) );
      this.target = app.game.buildings[index];
      return true
    }
  },

  step: function(delta) {
      this.followPath(delta);

      if(utils.hasArrayItem(this.states, 'orbiting')) {
        this.rate -= delta;
        if(this.rate <= 0 && this.targetUnit()) {
          this.targetUnit();
          this.fire();
          this.rate = this.cooldown;
        } 
      }
  },

  render: function(delta) {
    /*
    app.layer
      .moveTo(app.width/2, app.height+30)
      .quadraticCurveTo(this.x+this.orbit, app.height+30, this.x+this.orbit, this.y)
      .lineWidth(1)
      .strokeStyle('rgba(255,255,255,0.1)')
      .stroke()

      .beginPath()
      .arc(this.x,this.y,this.orbit,0,2*Math.PI,true)
      .closePath()
      .lineWidth(1)
      .strokeStyle('rgba(255,255,255,0.1)')
      .stroke();
    */

    app.layer
      .fillStyle('rgba(255,255,255,0.3)')
      .closedcircle(this.unitx, this.unity, 7)
      .fill();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
