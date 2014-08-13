ENGINE.Laser = function(args) {

  _.extend(this, {
    path: 0,
    speed: 0.9,
  }, args);

};

ENGINE.Laser.prototype = {

  followPath: function(delta) {
    this.path += (this.speed * delta) / 1000;
        
    //console.log(utils.getLineDistance(this.start, this.end));
    if(this.path >= 1) this.remove();
    var xy = utils.getLineXYatPercent(
      this.start,
      this.end,
      this.path
    );
    this.x = xy.x;
    this.y = xy.y;
  },

  step: function(delta) {
      this.followPath(delta);
  },

  render: function(delta) {
    app.layer
      .fillStyle('rgba(255,255,255,1)')
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
