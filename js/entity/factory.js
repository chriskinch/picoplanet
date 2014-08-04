ENGINE.Factory = function(args) {

  _.extend(this, {
    selectable: true,
    draggable: true
  }, args);

};

ENGINE.Factory.prototype = {

  step: function(delta) {
    //console.log(utils.mousexy());
  },

  render: function(delta) {
    app.layer
      .fillStyle("#ff2222")
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
