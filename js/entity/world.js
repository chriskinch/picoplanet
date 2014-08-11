ENGINE.World = function(args) {

  _.extend(this, {
    x: app.width/2,
    y: app.height/2,
    image: app.assets.image("circle"),
    width: 200,
    height: 200,
    radius: 100,
    speed: 1,
    cycle: 0,
    snapcount: 10,
    snappoints: [],
  }, args);

};

ENGINE.World.prototype = {
  create: function() {
    this.snapPoints()
  },

  step: function(delta) {
    //this.cycle += this.speed / (delta*20);
  },

  render: function(delta) {

    app.layer
      .save()
      .translate(this.x, this.y)
      .drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height)
      .restore();

  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  },

  snapPoints: function() {
    for(var i=0; i<this.snapcount; i++) {
      var snappoint = app.game.entities.add(ENGINE.SnapPoint);
      app.game.snappoints.push(snappoint);
      this.snappoints.push(snappoint);
    }
    utils.arrangeToArc(this.snappoints, this);
  }
};
