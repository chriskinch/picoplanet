ENGINE.Collection = function(parent) {

  /* the object that manages the collection */
  this.parent = parent;

  /* unique id for every entitiy */
  this.index = 0;

  /* if something inside dies - it needs to be removed,
     it is so tempting to call it *filthy* instead */
  this.dirty = false;
}

/* copy array prototype */
ENGINE.Collection.prototype = new Array;

_.extend(ENGINE.Collection.prototype, {

  /* creates new object instance with given args and pushes it to the collection*/
  add: function(constructor, args) {
    var entity = new constructor(_.extend({
      collection: this,
      index: this.index++,
    }, args));

    this.push(entity);

    return entity;
  },

  /* remove dead bodies so they don't drain CPU lying around */
  clean: function() {

    for(var i=0; i < this.length; i++){
      if (this[i]._remove) {
        this.splice(i--, 1);
        len--;
      }
    }

  },

  /* needs to be called in order to keep track on collection's garbage */
  step: function(delta) {

    /* check if some removals needs to be applied */
    if (this.dirty) {

      this.dirty = false;
      this.clean();

      /* also let's sort the entities by the zIndex */
      this.sort(function(a, b) {
        return (a.zIndex | 0) - (b.zIndex | 0);
      });
    }

  },

  /* call some method of every entitiy
       ex: enemies.call("shoot", 32, 24);
  */
  call: function(method) {

    /* because `arguments` is not a real array and it does not have slice method
       and we need to get rid of first argument which is a method name */
    var args = Array.prototype.slice.call(arguments, 1);

    for(var i=0; i < this.length; i++){
      if(this[i][method]) this[i][method].apply(this[i], args);
    }
  },

  /* call some method of every entitiy
       ex: enemies.apply("shoot", [32, 24]);
     the difference is that it takes an array - not list of arguments
  */
  apply: function(method, args) {
    for(var i=0; i < this.length; i++){
      if(this[i][method]) this[i][method].apply(this[i], args);
    }
  },

  state: function(entity, string, state) {  
    if(state !== undefined && entity.states) {
      entity.states = utils.setArrayItem(entity.states, string, state);
    }

    if(entity.states) {
      return utils.hasArrayItem(entity.states, string);
    }
  },

  // hover: function(entity, x, y) {
  //   var box = [entity.x-entity.width/2, entity.x+entity.width/2, entity.y-entity.height/2, entity.y+entity.height/2];
  //   var hit = (box && x >= box[0] && x <= box[1] && y >= box[2] && y <= box[3]) ? true : false;
  //   entity.mouseover = hit;
  // },

  ismouseover: function(x, y) {
    for(var i=0; i < this.length; i++){
        var box = [this[i].x-this[i].width/2, this[i].x+this[i].width/2, this[i].y-this[i].height/2, this[i].y+this[i].height/2];
        var hover = (box && x >= box[0] && x <= box[1] && y >= box[2] && y <= box[3]) ? true : false;
        this.state(this[i], 'mouseover', hover);
        if(hover) this[i];
    }
  },

  issnap: function(x, y) {
    var dx, dy, distance, entity;
    for(var i=0; i < this.length; i++){
      if(this.state(this[i], 'dragging')) entity = this[i];

      if(this[i].snappoint !== undefined) {
        dx = x - this[i].x;
        dy = y - this[i].y;
        distance = Math.sqrt(dx * dx + dy * dy);
      }

      if(distance < this[i].snapdistance) {
        for(var j=0; j < this.length; j++){
          if(this.state(this[j], 'dragging')) {
            this.state(this[j], 'dragging', false);
            this.state(this[j], 'snapped', true);
            this[j].x = this[i].x - this[j].width/2;
            this[j].y = this[i].y - this[j].height/2;
          }
        }
      }
    }

  },

  select: function(button){
    for (var i = 0; i < this.length; i++) {
      if(button === 0 && this.state(this[i], 'draggable') && this.state(this[i], 'mouseover')) {
        this.state(this[i], 'dragging', true);
      }
    }
  },

  drag: function(x, y) {
    for(var i=0; i < this.length; i++){
      if(this.state(this[i], 'dragging')) {
        this[i].x = x - this[i].height/2;
        this[i].y = y - this[i].width/2;
      }
    }
  },

  drop:function(x, y) {
    for(var i=0; i < this.length; i++){
      this.state(this[i], 'dragging', false);
    }
  }

});
