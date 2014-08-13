app.game = new ENGINE.Scene({

  oncreate: function() {
    this.time = 0;
    this.snappoints = [];
    this.credit = 30;
    this.power = 0;
    this.population = 0;
    this.defence = 0;
    this.round = 1;
    this.enemy_count = 0;
    this.buildings = [];

    this.entities = new ENGINE.Collection(this);
  },

  onenter: function() {
    this.inv_factory = this.entities.add(ENGINE.Inventory, {
      x: 20,
      y: 20,
      fill: '#993333',
    });
    this.factory = [];

    this.inv_residence = this.entities.add(ENGINE.Inventory, {
      x: 20,
      y: 50,
      fill: '#339900',
    });
    this.residence = [];

    this.inv_defences = this.entities.add(ENGINE.Inventory, {
      x: 20,
      y: 80,
      fill: '#999933',
    });
    this.defences = [];

    this.world = this.entities.add(ENGINE.World);

    this.entities.call("create");

    /* create gui */
    this.gui = new dat.GUI();
    this.gui.add(this, 'credit', 0).listen();
    this.gui.add(this, 'power', 0).listen();
    this.gui.add(this, 'population', 0).listen();
    this.gui.add(this, 'defence', 0).listen();
  },

  onstep: function(delta) {
    this.entities.step(delta);
    this.entities.call("step", delta);

    // game clock in seconds
    this.time += delta / 1000;
    if(this.time > 1 && this.enemy_count < this.round) {
      this.enemy = this.entities.add(ENGINE.Enemy);
      this.enemy_count++;
    }
  },

  onrender: function(delta) {
    app.layer.clear("#111");
    this.entities.call("render", delta);
  },

  onmousedown: function(x, y, button) {
    this.entities.select(button);
    if(this.state(this.inv_factory, 'mouseover')) {
      this.spawnBuilding('Factory', x, y);
    }
    if(this.state(this.inv_residence, 'mouseover')) {
      this.spawnBuilding('Residence', x, y);
    }
    if(this.state(this.inv_defences, 'mouseover')) {
      this.spawnBuilding('Defences', x, y);
    }
  },

  onmousemove: function(x, y) {
    this.entities.ismouseover(x, y);
    this.entities.issnapped(x, y);
    this.entities.drag(x, y);
  },

  onmouseup: function(x, y) {
    this.entities.drop(x, y);
    this.dragging = false;
  },

  state: function(entity, string, state) {  
    if(state !== undefined && entity.states) {
      entity.states = utils.setArrayItem(entity.states, string, state);
    }

    if(entity.states) {
      return utils.hasArrayItem(entity.states, string);
    }
  },

  spawnBuilding: function(type, x, y) {
    var constructor = ENGINE[type]; 
    var name = type.toLowerCase();
    var width = height = 20;
    var building = this.entities.add(constructor);
    this.buildings.push(building);
    this.dragging = true;
  },

});
