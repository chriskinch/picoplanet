ENGINE.Inventory = function(args) {

  _.extend(this, {
    group: 'inventory',
    width: 40,
    height: 20,
    radius: 10,

    state: {}
  }, args);

};

ENGINE.Inventory.prototype = {

  step: function(delta) {
    
  },

  render: function(delta) {
    // app.layer
    //   .fillStyle(this.fill)
    //   .closedcircle(this.x, this.y, this.radius)
    //   .fill();

    app.layer
      .save()
      .translate(this.x, this.y)
      .fillStyle(this.fill)
      .roundRect(-this.width/2, -this.height/2, this.width, this.height, this.radius)
      .fill()
      .restore();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
