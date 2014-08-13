ENGINE.SnapPoint = function(args) {

  _.extend(this, {
    width: 50,
    height: 50,
    radius: 7,
    snappoint: true,
    snapdistance: 25,
    states:[],
    stroke: 'rgba(255,255,255,0)',
    opacity: 0,
  }, args);

};

ENGINE.SnapPoint.prototype = {
  create: function() {

  },

  step: function(delta) {
    if(app.game.dragging === true && this.opacity <= 0.4) {
      this.opacity += delta/1000;
      this.stroke = 'rgba(255,255,255,'+this.opacity+')';
    }else if(this.opacity >= 0){
      this.opacity -= delta/1000;
      this.stroke = 'rgba(255,255,255,'+this.opacity+')';
    }
  },

  render: function(delta) {

    // app.layer
    //   .fillStyle('rgba(255, 255, 255, 0.1)')
    //   .closedcircle(this.x, this.y, this.radius*5)
    //   .fill();

    app.layer
      .strokeStyle(this.stroke)
      .closedcircle(this.x, this.y, this.radius)
      .stroke();
  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
