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

    state: {
      selectable: true,
    }
  }, args);

  this.snapPoints();
};

ENGINE.World.prototype = {
  upgrade: function() {
    var game = app.game;
    var credit = 10 * game.planet.level,
        engineers = 3 * game.planet.level + 3,
        power = 10 * game.planet.level + 10;

        console.log(credit, engineers, power);

    if(game.planet.level < game.planet.level_cap &&
    game.inv_world.mouseover &&
    game.credit >= credit &&
    game.engineers >= engineers &&
    game.power >= power ||
    game.god_mode) {
      game.credit -= credit;
      game.planet.level++;
      game.world.new_radius *= 1.2;
      game.world.snapcount *= 1.34;
    }
  },

  snapPoints: function() {
    var snappoints = Math.floor(this.snapcount) - this.snappoints.length;
    for(var i=0; i<snappoints; i++) {
      var snappoint = app.game.entities.add(ENGINE.SnapPoint, {parent:'world'});
      this.snappoints.push(snappoint);
    }
    utils.arrangeToArc(this.snappoints, this);
  },

  step: function(delta) {
    if(this.radius < this.new_radius) {
      this.radius += 1;
      this.snapPoints();
    }

  },

  render: function(delta) {
    if(this.state.selected) {
      app.layer
        .fillStyle('#fff')
        .closedcircle(this.x, this.y, this.radius+3)
        .fill();
    }

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
  }
};
