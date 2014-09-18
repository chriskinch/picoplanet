app.game = new ENGINE.Scene({

  oncreate: function() {
    this.god_mode = false;
    this.time = 0;
    this.credit = 50;
    this.power = 0;
    this.engineers = 0;
    this.defence = 0;
    this.tech = 0;
    
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

    this.mouseover = undefined;

    this.entities = new ENGINE.Collection(this);
  },

  onenter: function() {
    this.inv_factory = this.entities.add(ENGINE.Inventory, {
      spawn: 'Factory',
      x: 40,
      y: 30,
      fill: '#333399',
    });

    this.inv_engineering = this.entities.add(ENGINE.Inventory, {
      spawn: 'Engineering',
      x: 40,
      y: 60,
      fill: '#339900',
    });

    this.inv_defences = this.entities.add(ENGINE.Inventory, {
      spawn: 'Defences',
      x: 40,
      y: 90,
      fill: '#999933',
    });

    this.inv_lab = this.entities.add(ENGINE.Inventory, {
      spawn: 'Lab',
      x: 40,
      y: 120,
      fill: '#993333',
    });

    this.inv_building = this.entities.add(ENGINE.Inventory, {
      x: 40,
      y: 160,
      fill: '#bbccaa',
    });

    this.inv_world = this.entities.add(ENGINE.Inventory, {
      x: 40,
      y: 190,
      fill: '#ccaa99',
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
    this.gui.add(this, 'tech', 0).listen();
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
    this.mouseover = this.over(x, y);
    this.drag();

    if(this.mouseover && this.mouseover.group == 'inventory') {
      this.spawnBuilding(this.mouseover.spawn, x, y);
    }

    if(this.inv_world.mouseover) {
      this.upgradePlanet();
    }
    
    //this.entities.grab(button);
    //this.select();    
  },

  onmousemove: function(x, y) {
    this.mousex = x;
    this.mousey = y;
  },

  onmouseup: function(x, y) {
    this.drop();
  },

  over: function(x, y) {
    this.mouseover = undefined;
    var hovers = [];
    _.invoke(this.entities, function(){
      var box = [this.x-this.width/2, this.x+this.width/2, this.y-this.height/2, this.y+this.height/2];
      var hover = (box && x >= box[0] && x <= box[1] && y >= box[2] && y <= box[3]) ? this : undefined;
      if(hover && !this.disabled) hovers.push(hover);
    });
    if(hovers.length > 0) return hovers[0];
  },

  drag: function(){
    this.dragitem = this.mouseover && this.mouseover.state.draggable ? this.mouseover : undefined;
    if(this.dragitem && this.dragitem.state) this.dragitem.state.dragging = true;
  },

  drop: function() {
    if(this.dragitem) this.dragitem.state.dragging = false;
    this.dragitem = undefined;
  },

  select: function() {
    if(app.game.mouseover && app.game.mouseover.state && app.game.mouseover.state.selectable) {
      app.game.selected.state.selected = false;
      app.game.selected = app.game.mouseover;
      app.game.selected.state.selected = true;
    }
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
      this.world.new_radius *= 1.2;
      this.world.snapcount *= 1.34;
    }
  },

  spawnBuilding: function(type, x, y) {
    if(this.credit >= this.buildings.cost && type) {
      var constructor = ENGINE[type]; 
      var name = type.toLowerCase();
      var width = height = 20;
      var building = this.entities.add(constructor);
      this.selected = building;
      this.dragitem = building;
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
