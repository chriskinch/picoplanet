ENGINE.World = function(args) {

  var radius = 70;

  _.extend(this, {
    x: app.width/2,
    y: app.height/2,
    image: app.assets.image("circle"),
    width: 140,
    height: 140,
    new_radius: radius,
    radius: radius,
    speed: 1,
    cycle: 0,
    level: 1,
    fill: '#55dd44',
    snapcount: 9,
    snappoints: [],

    state: {}
  }, args);

  this.snapPoints();
};

ENGINE.World.prototype = {
  step: function(delta) {
    if(this.radius < this.new_radius) {
      this.radius += 1;
      this.snapPoints();
    }

  },

  render: function(delta) {

    app.layer
      //.save()
      //.translate(this.x, this.y)
      .fillStyle(this.fill)
      .closedcircle(this.x, this.y, this.radius)
      .fill();
      //.restore();

  },

  remove: function() {

    /* mark for removal */
    this._remove = true;

    /* tell the collection that there are some dead animals in the ventilation */
    this.collection.dirty = true;
  },

  snapPoints: function() {
    var snappoints = Math.floor(this.snapcount) - this.snappoints.length;
    for(var i=0; i<snappoints; i++) {
      var snappoint = app.game.entities.add(ENGINE.SnapPoint, {parent:'world'});
      this.snappoints.push(snappoint);
    }
    utils.arrangeToArc(this.snappoints, this);
  }
};
