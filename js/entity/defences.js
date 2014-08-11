ENGINE.Defences = function(args) {

  _.extend(this, {
    x: app.game.inv_defences.x - 10,
    y: app.game.inv_defences.y - 10,
    width: 20,
    height: 20,
    fill: app.game.inv_defences.fill,
    rate: 4000,
    cooldown: 4000,
    cost: 20,
    build: 1000,
    constructed: 0,
    selectable: true,
    draggable: true,
    snappable: true,
    states:['dragging'],
  }, args);

};

ENGINE.Defences.prototype = {
  gather: function(delta) {
    this.rate -= delta;

    if(this.rate <= 0) {
      app.game.defence += 1;
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
    this.cap = app.game.defences.length;
    if(utils.hasArrayItem(this.states, 'snapped') && app.game.defence < this.cap ) {
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
