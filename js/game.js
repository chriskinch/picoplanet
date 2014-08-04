app.game = new ENGINE.Scene({

  oncreate: function() { 

    this.entities = new ENGINE.Collection(this);    

  },

  onenter: function() {
    this.gui = this.entities.add(ENGINE.Gui);
    this.world = this.entities.add(ENGINE.World);   

    /* create gui */
    var gui = new dat.GUI();
    gui.add(app.game.world, 'speed', 1, 30).step(1);
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
    if(this.gui.mouseover) this.spawnFactory(x, y);
  },

  onmousemove: function(x, y) {
    this.entities.checkmouseover(x, y);
    this.entities.drag(x, y);
  },

  onmouseup: function(x, y) {
    this.entities.drop(x, y);
  },

  spawnFactory: function(x, y, button) {
    var width = height = 40;
    this.factory = this.entities.add(ENGINE.Factory, {
      x: this.gui.x - width/2, 
      y: this.gui.y - height/2,
      width: width,
      height: height,
      dragging: true
    });
  }

});
