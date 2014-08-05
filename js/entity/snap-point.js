ENGINE.SnapPoint = function(args) {

  _.extend(this, {
    width: 50,
    height: 50,
    radius: 5,
    snappoint: true,
    snapdistance: 25,
    states:[],
    fill: '#444444'
  }, args);

};

ENGINE.SnapPoint.prototype = {
  create: function() {

  },

  step: function(delta) {
    //console.log(utils.mousexy());
  },

  render: function(delta) {

    // app.layer
    //   .fillStyle('rgba(255, 255, 255, 0.1)')
    //   .closedcircle(this.x, this.y, this.radius*5)
    //   .fill();

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
