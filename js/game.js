app.game = new ENGINE.Scene({

  oncreate: function() {
    this.time = 0;
    this.credit = 50;
    this.power = 0;
    this.population = 0;
    this.defence = 0;
    
    this.buildings = {
      count: 0,
      factory: 0,
      residence: 0,
      defences: 0,
    };

    this.enemies = {
      spawnable: false,
      wave_total: 0,
      time: 1,
      next_wave_time: 1,
      spawned: 0,
      count: 0,
      spawn_rate: 1000,
      spawn_cooldown: 1000,
    };

    this.entities = new ENGINE.Collection(this);
  },

  onenter: function() {
    this.inv_factory = this.entities.add(ENGINE.Inventory, {
      x: 20,
      y: 20,
      fill: '#993333',
    });

    this.inv_residence = this.entities.add(ENGINE.Inventory, {
      x: 20,
      y: 50,
      fill: '#339900',
    });

    this.inv_defences = this.entities.add(ENGINE.Inventory, {
      x: 20,
      y: 80,
      fill: '#999933',
    });

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

    this.enemySpawnLogic(delta);
  },

  onrender: function(delta) {
    app.layer.clear("#111");
    this.entities.call("render", delta);
  },

  onmousedown: function(x, y, button) {
    if(this.inv_factory.mouseover) {
      this.spawnBuilding('Factory', x, y);
    }
    if(this.inv_residence.mouseover) {
      this.spawnBuilding('Residence', x, y);
    }
    if(this.inv_defences.mouseover) {
      this.spawnBuilding('Defences', x, y);
    }

    this.entities.grab(button);
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

  spawnBuilding: function(type, x, y) {
    var constructor = ENGINE[type]; 
    var name = type.toLowerCase();
    var width = height = 20;
    this.entities.add(constructor);
    this.buildings[name]++;
    this.buildings.count++;
  },

  enemySpawnLogic: function(delta) {
    if(this.enemies.time > 0 && this.enemies.count == 0) {
      this.enemies.time -= delta / 1000;
      if(this.enemies.time <= 0) {
        console.log("Next Wave!")
        this.enemies.spawnable = true;
        this.enemies.spawned = 0;
        this.enemies.wave_total++;
        this.enemies.time = this.enemies.next_wave_time;
      }
    }

    if(this.enemies.spawnable) {
      this.enemies.spawn_rate -= delta;
      if(this.enemies.spawn_rate < 0){
        this.entities.add(ENGINE.Enemy);
        this.enemies.spawn_rate = this.enemies.spawn_cooldown;
        this.enemies.count++;
        this.enemies.spawned++;
      }

      if(this.enemies.spawned >= this.enemies.wave_total) {
        this.enemies.spawnable = false;
      }
    }
  }

});
