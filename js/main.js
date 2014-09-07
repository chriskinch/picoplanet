var app = new ENGINE.Application({

  width: window.innerWidth,
  height: window.innerHeight,

  oncreate: function() {

    this.assets.addImages(["circle.svg"]);
  },

  onready: function() {

    this.selectScene(this.game);
  }

});
