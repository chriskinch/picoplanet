ENGINE.Gui = function(args) {

  _.extend(this, {
    mouseover:false,
    x: 20,
    y: 20,
    width: 20,
    height: 20,
    radius: 10,
    selectable: true 
  }, args);

};

ENGINE.Gui.prototype = {

  step: function(delta) {
    
  },

  render: function(delta) {
    app.layer
      .circle(this.x, this.y, this.radius)
      .fillStyle("#ff0000")
      .fill();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
