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

  select: function(name, array) {
    for(var i=0; i < this.length; i++){
      if(this[i].name == name) var entity = this[i];
    }
    return entity;
  },

  filter: function(param, array, name) {
    var group = [];
    for(var i=0; i < array.length; i++){
      if(array[i][param] == name) group.push(array[i]);
    }
    return group;
  },

  ismouseover: function(x, y) {
    for(var i=0; i < this.length; i++){
      
        var _this = (this[i].physics) ? this[i].physics : this[i],
        state = (this[i].physics) ? this[i].state : this[i],
        box = [
          _this.x-_this.width/2,
          _this.x+_this.width/2,
          _this.y-_this.height/2,
          _this.y+_this.height/2
        ];
        var hover = (box && x >= box[0] && x <= box[1] && y >= box[2] && y <= box[3]) ? true : false;
        //console.log(state);
        state.mouseover = hover;
        //if(hover) console.log(this[i]);
    }

  },

  issnapped: function(x, y) {
    if(this.parent.dragitem) {
      var dx, dy, distance;
      var snappoints = (this.parent.dragitem.physics) ? this.parent.dragitem.snap_data.snap_to.snappoints : this.parent.dragitem.snap_to.snappoints;

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
    var state = (entity.physics) ? entity.state : entity;
    var snap_data = (entity.physics) ? entity.snap_data : entity;
    state.snapped = true;
    state.selected = false;
    snap_data.snappoint = snappoint;
    snappoint.snapped = true;
    this.drop();
  },

  highlight: function() {
    this.parent.selected = null;
    for(var i=0; i < this.length; i++){
      var state = (this[i].physics) ? this[i].state : this[i];
      if(state.selectable && !state.selected && state.mouseover) {
        state.selected = true;
        this.parent.selected = this[i];
      }else if(state.selectable){
        state.selected = false;
      }
    }
  },

  grab: function() {
    for(var i=0; i < this.length; i++){
      var state = (this[i].physics) ? this[i].state : this[i];
      if(state.draggable && state.mouseover) {     
        state.grabbed = true;
        this.parent.dragitem = this[i];
      }
    }
  },

  drag: function(x, y) {
    for(var i=0; i < this.length; i++){
      var state = (this[i].physics) ? this[i].state : this[i];
      if(state.grabbed) {
        state.dragging = true;
        this[i].x = x;
        this[i].y = y;
      }
    }
  },

  drop: function(x, y) {
    for(var i=0; i < this.length; i++){
      var state = (this[i].physics) ? this[i].state : this[i];
      if(state.dragging || state.grabbed) {
        state.dragging = false;
        state.grabbed = false;
        this.parent.dragitem = undefined;
      }
    }
  }

});
