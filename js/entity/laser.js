ENGINE.Laser = function(args) {

  _.extend(this, {
    path: 0,
    speed: 1,
  }, args);

};

ENGINE.Laser.prototype = {

  followPath: function(delta) {
    this.path += (this.speed * delta) / 1000;

    if(this.path >= 1) {
      this.remove();
      this.target.counter.health -= 1;
    }
    var xy = utils.getLineXYatPercent(
      this.start,
      this.end,
      this.path
    );
    this.x = xy.x;
    this.y = xy.y;
  },

  step: function(delta) {
    this.end = { x:this.target.x, y:this.target.y }
    this.followPath(delta);
  },

  render: function(delta) {
    app.layer
      .fillStyle(this.color)
      .closedcircle(this.x, this.y, 3)
      .fill();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
