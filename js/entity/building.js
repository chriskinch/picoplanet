ENGINE.Building = function(args) {

  _.extend(this, {
    states:['selectable', 'draggable', 'dragging', 'snappable'],
    rate: 3000,
  }, args);

};

ENGINE.Building.prototype = {

  step: function(delta) {
    if(utils.hasArrayItem(this.states, 'snapped')) {
      this.rate -= delta;

      if(this.rate <= 0) {
        console.log("tick");
        this.rate = 3000;
      }
    }
  },

  render: function(delta) {
    app.layer
      .fillStyle(this.fill)
      .fillRect(this.x, this.y, this.width, this.height);
      //.setOrigin("center", "center");
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
