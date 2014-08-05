ENGINE.Residence = function(args) {

  _.extend(this, {
    states:['selectable', 'draggable', 'dragging', 'snappable'],
  }, args);

};

ENGINE.Residence.prototype = {

  step: function(delta) {
    //if(this.snaps.mouseover) console.log("over");
  },

  render: function(delta) {
    app.layer
      .fillStyle("#2222ff")
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
