ENGINE.Factory = function(args) {

  _.extend(this, {
    group: 'building',
    x: app.game.inv_factory.x,
    y: app.game.inv_factory.y,
    width: 20,
    height: 20,
    fill: '#993333',
    back: '#550000',
    rate: 3000,
    cooldown: 3000,
    cost: 10,
    build: 300,
    max_health:10,
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

ENGINE.Factory.prototype = {

  gather: function(delta) {
    this.rate -= delta;

    if(this.rate <= 0) {
      app.game.credit += 1;
      this.rate = this.cooldown;
    }
  },

  construction: function(delta) {
    app.game.credit -= this.cost;
    this.cost = 0;
    if(this.constructed < this.build) {
      this.constructed += 1;
    }
  },

  step: function(delta) {
    if(this.snapped) {
      this.construction(delta);
      var build_percent = this.constructed/this.build * 100;
      if(build_percent >= 100) {
        this.gather(delta);
        this.built = true;
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
    app.game.buildings.factory--;
  }
};
