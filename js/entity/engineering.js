ENGINE.Engineering = function(args) {

  _.extend(this, {
    group: 'building',
    x: app.game.inv_engineering.x - 10,
    y: app.game.inv_engineering.y - 10,
    width: 20,
    height: 20,
    fill: '#339933',
    back: '#005500',
    rate: 0,
    cooldown: 100,
    gather_rate: 3000,
    gather_cooldown: 3000,
    cost: app.game.buildings.cost,
    cap: 3,
    build: 100,
    max_health: 10,
    health: 10,
    constructed: 0,
    snap_to: app.game.world,
    snappoint: undefined,
    selectable: true,
    draggable: true,
    snappable: true,
    grabbed: true,
    mouseover: true,
  }, args);

  /* On spawn */
  app.game.credit -= this.cost;
};

ENGINE.Engineering.prototype = {

  construct: function() {
    if(!this.built && this.snapped) {
      if(this.constructed < this.build) {
        this.constructed++;
      }
      var build_percent = this.constructed/this.build * 100;

      if(build_percent >= 100) {
        this.built = true;
      }
    }
  },

  gather: function() {
    if(this.built && app.game.engineers < app.game.buildings.engineering * this.cap) {
      app.game.engineers++;
    }
  },

  repair: function() {
    if(this.built) {
      var buildings = app.game.entities.group('group', 'building'),
          damaged = [];
      
      //console.log(capped);
      
      _.each(buildings, function(building, index){
        if(building.health < building.max_health && app.game.credit > 0) {
          damaged.push(building);
        }
      });

      var capped = damaged.splice(0, this.cap);

      _.each(capped, function(building, index){
        console.clear();
        console.info(capped);
        building.health += 0.05;
        app.game.credit -= 0.025;
      });
      
    }
  },

  step: function(delta) {
    this.rate -= delta;
    if(this.rate <= 0) {
      this.construct();
      this.repair();
      this.rate = this.cooldown;
    }
  
    this.gather_rate -= delta;
    if(this.gather_rate <= 0) {
      this.gather();
      this.gather_rate = this.gather_cooldown;
    }

    this.health_percent = this.health/this.max_health;
    if(this.health <= 0) this.remove();
  },

  render: function(delta) {
    var world = app.game.world;
    var dx = app.game.world.x - this.x;
    var dy = app.game.world.y - this.y;
    var rad = Math.atan2(dx, dy) + Math.PI;

    if(this.snappoint) {
      this.x = this.snappoint.x;
      this.y = this.snappoint.y;
    }

    app.layer
      .save()
      .translate(this.x, this.y)
      .rotate(-rad)
      .fillStyle(this.back)
      .fillRect(-this.width/2, -this.height/2, this.width, this.height)
      .restore();

    app.layer
      .save()
      .translate(this.x, this.y)
      .rotate(-rad)
      .fillStyle(this.fill)
      .fillRect(-this.width/2, -this.height/2, this.width, this.height * this.health_percent)
      .restore();

    // app.layer
    //   .fillStyle('#fff')
    //   .closedcircle(this.x, this.y, 1)
    //   .fill();
    // app.layer
    //   .save()
    //   .beginPath()
    //   .moveTo(world.x, world.y)
    //   .lineTo(this.x, this.y)
    //   .strokeStyle('#f00')
    //   .stroke()
    //   .restore();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;

    app.game.buildings.count--;
    app.game.buildings.engineering--;
  }
};