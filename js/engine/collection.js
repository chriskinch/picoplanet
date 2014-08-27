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

    for(var i=0, len=this.length; i < len; i++){
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

  group: function(param, name) {
    var group = [];
    for(var i=0; i < this.length; i++){
      if(this[i][param] == name) group.push(this[i]);
    }
    return group;
  },

  select: function(name) {
    for(var i=0; i < this.length; i++){
      if(this[i].name == name) var entity = this[i];
    }
    return entity;
  },

  filter: function(param, name, array) {
    var group = [];
    for(var i=0; i < array.length; i++){
      if(array[i][param] == name) group.push(array[i]);
    }
    return group;
  },

  ismouseover: function(x, y) {
    for(var i=0; i < this.length; i++){
        var box = [this[i].x-this[i].width/2, this[i].x+this[i].width/2, this[i].y-this[i].height/2, this[i].y+this[i].height/2];
        var hover = (box && x >= box[0] && x <= box[1] && y >= box[2] && y <= box[3]) ? true : false;
        this[i].mouseover = hover;
        //if(hover) console.log(this[i]);
    }

  },

  issnapped: function(x, y) {
    if(this.parent.dragitem) {
      var dx, dy, distance,
          snappoints = this.parent.dragitem.snap_to.snappoints;

      for(var i=0; i < snappoints.length; i++){
        if(!snappoints[i].snapped) {
          dx = x - snappoints[i].x;
          dy = y - snappoints[i].y;
          distance = Math.sqrt(dx * dx + dy * dy);

          if(distance < snappoints[i].snapdistance) {
            this.snap(this.parent.dragitem, snappoints[i], x, y);
          }
        }
      }
    }
  },

  snap: function(entity, snappoint, x, y) {
    entity.snapped = true;
    entity.selected = false;
    entity.snappoint = snappoint;
    snappoint.snapped = true;
    this.drop();
  },

  highlight: function(button) {
    for(var i=0; i < this.length; i++){
      if(button === 0 && this[i].selectable && !this[i].selected &&this[i].mouseover) {
        this[i].selected = true;
      }else {
        this[i].selected = false;
      }
    }
  },

  grab: function(button) {
    for(var i=0; i < this.length; i++){
      if(button === 0 && this[i].draggable && this[i].mouseover) {     
        this[i].grabbed = true;
        this.parent.dragitem = this[i];
      }
    }
  },

  drag: function(x, y) {
    for(var i=0; i < this.length; i++){  
      if(this[i].grabbed) {
        this.dragging = true;
        this[i].x = x;
        this[i].y = y;
      }
    }
  },

  drop: function(x, y) {
    for(var i=0; i < this.length; i++){
      if(this[i].dragging || this[i].grabbed) {
        this[i].dragging = false;
        this[i].grabbed = false;
        this.parent.dragitem = undefined;
      }
    }
  }

});
