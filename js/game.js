app.game = new ENGINE.Scene({

  oncreate: function() {
    this.god_mode = false;
    this.time = 0;
    this.credit = 50;
    this.power = 0;
    this.engineers = 0;
    this.defence = 0;
    this.researchers = 0;
    
    this.planet = {
      level: 1,
      level_cap: 5,
    }

    this.buildings = {
      count: 0,
      factory: 0,
      engineering: 0,
      defences: 0,
      lab: 0,
      cost: 10,
    };

    this.enemies = {
      spawnable: false,
      wave_total: 0,
      time: 1,
      next_wave_time: 10,
      spawned: 0,
      count: 0,
      spawn_rate: 1000,
      spawn_cooldown: 1000,
    };

    this.entities = new ENGINE.Collection(this);
  },

  onenter: function() {
    this.inv_factory = this.entities.add(ENGINE.Inventory, {
      x: 40,
      y: 30,
      fill: '#333399',
    });

    this.inv_engineering = this.entities.add(ENGINE.Inventory, {
      x: 40,
      y: 60,
      fill: '#339900',
    });

    this.inv_defences = this.entities.add(ENGINE.Inventory, {
      x: 40,
      y: 90,
      fill: '#999933',
    });

    this.inv_lab = this.entities.add(ENGINE.Inventory, {
      x: 40,
      y: 120,
      fill: '#993333',
    });

    this.inv_world = this.entities.add(ENGINE.Inventory, {
      x: 40,
      y: 160,
      fill: '#aabbcc',
    });

    this.world = this.entities.add(ENGINE.World);
    this.entities.call("enter");

    /* create gui */
    this.gui = new dat.GUI();
    this.gui.add(this.planet, 'level', 0).listen();
    this.gui.add(this, 'credit', 0).listen();
    this.gui.add(this, 'power', 0).listen();
    this.gui.add(this, 'engineers', 0).listen();
    this.gui.add(this, 'defence', 0).listen();
    this.gui.add(this, 'researchers', 0).listen();
  },

  onstep: function(delta) {
    this.entities.step(delta);
    this.entities.call("step", delta);

    // game clock in seconds
    this.time += delta / 1000;

    this.spawnEnemy(delta);
  },

  onrender: function(delta) {
    app.layer.clear("#111");
    this.entities.call("render", delta);
  },

  onmousedown: function(x, y, button) {
    if(this.inv_factory.mouseover) {
      this.spawnBuilding('Factory', x, y);
    }
    if(this.inv_engineering.mouseover) {
      this.spawnBuilding('Engineering', x, y);
    }
    if(this.inv_defences.mouseover) {
      this.spawnBuilding('Defences', x, y);
    }
    if(this.inv_lab.mouseover) {
      this.spawnBuilding('Lab', x, y);
    } 

    if(this.inv_world.mouseover) {
      this.upgradePlanet();
    }

    this.entities.grab(button);
    this.entities.highlight(button);
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

  upgradePlanet: function() {
    var credit = 10 * this.planet.level,
        engineers = 3 * this.planet.level + 3,
        power = 10 * this.planet.level + 10;

    if(this.planet.level < this.planet.level_cap &&
    this.inv_world.mouseover &&
    this.credit >= credit &&
    this.engineers >= engineers &&
    this.power >= power ||
    this.god_mode) {
      this.credit -= credit;
      this.planet.level++;
      console.log(Math.floor(this.world.snapcount * 0.34));
      this.world.new_radius *= 1.2;
      this.world.snapcount *= 1.34;
      
    }
  },

  spawnBuilding: function(type, x, y) {
    if(this.credit >= this.buildings.cost) {
      var constructor = ENGINE[type]; 
      var name = type.toLowerCase();
      var width = height = 20;
      this.entities.add(constructor);
      this.buildings[name]++;
      this.buildings.count++;
    }
  },

  spawnEnemy: function(delta) {
    if(this.enemies.time > 0 && this.enemies.count == 0) {
      this.enemies.time -= delta / 1000;
      if(this.enemies.time <= 0) {
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
