ENGINE.Physics = function(parent) {
  
  _.extend(parent, {
    /* Default params */
    group: 'building',
    width: 20,
    height: 20,

    upgrade: {
      height: 20,
    },

    timer: {
      rate: 0,
      cooldown: 1000,
      gather_rate: 3000,
      gather_cooldown: 3000,
    },

    counter: {
      build: 100,
      build_percent: 0,
      cap: parent.counter.cap,
      health: 10,
      max_health: 10,
    },

    snap_data: {
      snap_to: app.game.world,
      snappoint: undefined,
    },

    state: {
      selectable: true,
      draggable: true,
      snappable: true,
      grabbed: true,
      construct: true,
      mouseover: true,
      damaged: false,
    }
  });

  this.parent = parent;

  /* On spawn */
  app.game.credit -= app.game.buildings.cost;
};

ENGINE.Physics.prototype = {

  construct: function() {
    if(this.parent.counter.build_percent < this.parent.counter.build) {
      this.parent.counter.build_percent += 10;
    }else{
      this.parent.state.built = true;
      this.parent.counter.build_percent = 100;
    }
  },

  gather: function() {
    var cap = app.game.buildings[this.parent.type] * this.parent.counter.cap;
    console.log(app.game[this.parent.resource]);
    if(app.game[this.parent.resource] < cap) {
      app.game[this.parent.resource]++;
    }
  },

  upgrade: function(delta) {
    if(this.parent.height < this.parent.upgrade.height * this.parent.upgrade.level + this.parent.height && this.parent.state.built) {
      this.parent.height += this.parent.upgrade.height/10;
    }else{
      this.parent.state.upgrading = false;
    }
  },

  step: function(delta) {
    /* We use the delta to throttle the calls from step as this is
     * linked to onAnimationFrameRequest
     */

    /* Main rate timer */
    if(this.parent.state.snapped && !this.parent.state.built) {
      this.parent.timer.rate -= delta;
      if(this.parent.timer.rate <= 0) {
        if(this.parent.state.construct) this.construct();
        if(this.parent.state.upgrade) this.upgrade();
        this.parent.timer.rate = this.parent.timer.cooldown;
      }
    }
  
    /* Addition rate timers */
    if(this.parent.state.built) {
      this.parent.timer.gather_rate -= delta;
      if(this.parent.timer.gather_rate <= 0) {
        this.gather();
        this.parent.timer.gather_rate = this.parent.timer.gather_cooldown;
      }
    }

    /* Monitor current health and remove below 0 */
    this.parent.counter.health_percent = this.parent.counter.health/this.parent.counter.max_health;
    if(this.parent.counter.health <= 0) this.remove();

    /* Set damaged status */
    this.parent.state.damaged = (this.parent.counter.health < this.parent.counter.max_health) ? true : false;
  },

  render: function(delta) {
    var world = app.game.world;
    var dx = app.game.world.x - this.parent.x;
    var dy = app.game.world.y - this.parent.y;
    var rad = Math.atan2(dx, dy) + Math.PI;
    var fill = (this.parent.state.built) ? this.parent.colour.fill : 'rgba(255,255,255,0.2)';

    if(this.parent.snap_data.snappoint) {
      this.parent.x = this.parent.snap_data.snappoint.x;
      this.parent.y = this.parent.snap_data.snappoint.y;
    }

    app.layer
      .save()
      .translate(this.parent.x, this.parent.y)
      .rotate(-rad)
      .fillStyle(this.parent.colour.back)
      .fillRect(-this.parent.width/2, -this.parent.height/2, this.parent.width, this.parent.height)
      .restore();

    app.layer
      .save()
      .translate(this.parent.x, this.parent.y)
      .rotate(-rad)
      .fillStyle(fill)
      .fillRect(
        -this.parent.width/2, -this.parent.height/2,
        this.parent.width,
        this.parent.height * this.parent.counter.health_percent * (this.parent.counter.build_percent/100)
      )
      .restore();

    if(this.parent.state.selected) {
      app.layer
      .save()
      .translate(this.parent.x, this.parent.y)
      .rotate(-rad)
      .lineWidth(2)
      .strokeStyle('#fff')
      .strokeRect(-this.parent.width/2, -this.parent.height/2, this.parent.width, this.parent.height)
      .restore();
    }

    // app.layer
    //   .fillStyle('#fff')
    //   .closedcircle(this.parent.x, this.parent.y, 1)
    //   .fill();
    // app.layer
    //   .save()
    //   .beginPath()
    //   .moveTo(world.x, world.y)
    //   .lineTo(this.parent.x, this.parent.y)
    //   .strokeStyle('#f00')
    //   .stroke()
    //   .restore();
  },

  remove: function() {
    this.parent.snap_data.snappoint.snapped = undefined;

    /* mark for removal */
    this.parent._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.parent.collection.dirty = true;

    app.game.buildings.count--;
    app.game.buildings[this.parent.type]--;
  }
};
