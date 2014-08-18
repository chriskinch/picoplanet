ENGINE.Residence = function(args) {

  _.extend(this, {
    group: 'building',
    x: app.game.inv_residence.x - 10,
    y: app.game.inv_residence.y - 10,
    width: 20,
    height: 20,
    fill: '#339900',
    back: '#005500',
    gather_rate: 3000,
    gather_cooldown: 3000,
    cost: 5,
    cap: 3,
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

};

ENGINE.Residence.prototype = {

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
    if(this.gather_rate <= 0 && app.game.population < app.game.buildings.residence * this.cap) {
      app.game.population++;
      this.gather_rate = this.gather_cooldown;
    }
  },

  step: function(delta) {
    if(!this.built && this.snapped) this.construct(delta);

    if(this.built) this.gather(delta);

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
    app.game.buildings.residence--;
  }
};
