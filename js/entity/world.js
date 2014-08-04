ENGINE.World = function(args) {

  _.extend(this, {
    x: app.width/2,
    y: app.height/2,
    image: app.assets.image("circle"),
    width: app.assets.image("circle").width,
    height: app.assets.image("circle").height,
    speed: 1,
    cycle: 0,
  }, args);

};

ENGINE.World.prototype = {

  step: function(delta) {
    //this.cycle += this.speed / (delta*20);
  },

  render: function(delta) {

    app.layer
      .save()
      .translate(this.x, this.y)
      .drawImage(this.image, -this.width/2, -this.height/2)
      .restore(); 

  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  }
};
