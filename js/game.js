app.game = new ENGINE.Scene({

  oncreate: function() {
    this.snappoints = [];

    this.entities = new ENGINE.Collection(this);
  },

  onenter: function() {
    this.gui = {};
    this.gui.factory = this.entities.add(ENGINE.Gui, {
      x: 20,
      y: 20,
      fill: '#993333',
    });
    this.gui.residence = this.entities.add(ENGINE.Gui, {
      x: 20,
      y: 50,
      fill: '#339900',
    });
    this.gui.defences = this.entities.add(ENGINE.Gui, {
      x: 20,
      y: 80,
      fill: '#999933',
    });
    this.world = this.entities.add(ENGINE.World);

    this.entities.call("create");

    /* create gui */
    var gui = new dat.GUI();
    //gui.add(this.world, 'speed', 1, 30).step(1);
  },

  onstep: function(delta) {
    this.entities.step(delta);
    this.entities.call("step", delta);
  },

  onrender: function(delta) {
    app.layer.clear("#111");
    this.entities.call("render", delta);
  },

  onmousedown: function(x, y, button) {
    this.entities.select(button);
    if(this.entities.state(this.gui.factory, 'mouseover')) this.spawnBuilding('factory', x, y);
    if(this.entities.state(this.gui.residence, 'mouseover')) this.spawnBuilding('residence', x, y);
    if(this.entities.state(this.gui.defences, 'mouseover')) this.spawnBuilding('defences', x, y);
  },

  onmousemove: function(x, y) {
    this.entities.ismouseover(x, y);
    this.entities.issnap(x, y);
    this.entities.drag(x, y);
  },

  onmouseup: function(x, y) {
    this.entities.drop(x, y);
  },

  spawnBuilding: function(type, x, y) {
    var width = height = 20;
    this[type] = this.entities.add(ENGINE.Building, {
      x: this.gui[type].x - width/2,
      y: this.gui[type].y - height/2,
      width: width,
      height: height,
      fill: this.gui[type].fill,
    });
  },

  spawnFactory: function(x, y, button) {

  },

  spawnResidence: function(x, y, button) {

  }

});
