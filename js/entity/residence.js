ENGINE.Residence = function(args) {

  _.extend(this, {
    x: app.game.inv_residence.x - 10,
    y: app.game.inv_residence.y - 10,
    width: 20,
    height: 20,
    fill: app.game.inv_residence.fill,
    rate: 3000,
    cooldown: 3000,
    cost: 5,
    build: 1000,
    constructed: 0,
    selectable: true,
    draggable: true,
    snappable: true,
    states:['dragging'],
  }, args);

};

ENGINE.Residence.prototype = {

  gather: function(delta) {
    this.rate -= delta;

    if(this.rate <= 0) {
      app.game.population += 1;
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
    this.cap = app.game.residence.length * 3;
    if(utils.hasArrayItem(this.states, 'snapped') && app.game.population < this.cap ) {
      this.construction(delta);
      var build_percent = this.constructed/this.build * 100;
      if(build_percent >= 100) {
        this.gather(delta);
      }
    }
  },

  render: function(delta) {
    app.layer
      .fillStyle(this.fill)
      .fillRect(this.x, this.y, this.width, this.height);
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
