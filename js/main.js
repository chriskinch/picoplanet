var app = new ENGINE.Application({

  width: window.innerWidth,
  height: window.innerHeight,

  oncreate: function() {  
    
  	this.assets.addImages(["circle.svgz"]);

    /* load anything to let the objects being create before calling ready */
    this.loader.foo(500);
  },

  onready: function() {

    this.selectScene(this.game);
  }

});
