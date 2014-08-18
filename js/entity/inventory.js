ENGINE.Inventory = function(args) {

  _.extend(this, {
    group: 'inventory',
    width: 20,
    height: 20,
    radius: 10,
    selectable: true,
  }, args);

};

ENGINE.Inventory.prototype = {

  step: function(delta) {
    
  },

  render: function(delta) {
    app.layer
      .fillStyle(this.fill)
      .closedcircle(this.x, this.y, this.radius)
      .fill();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
