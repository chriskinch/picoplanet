import Planet from 'objects/Planet.js';
import Pallet from 'objects/Pallet.js';

class Main extends Phaser.State {
 	constructor() {
        super();
    }

    preload() {
        this.game.load.bitmapFont('carrier_command', '/src/assets/fonts/bitmap/carrier_command.png', '/src/assets/fonts/bitmap/carrier_command.xml');
        this.game.load.image('block', '/src/assets/sprites/block.png');
    }
 
    create() {
 		console.log("MAIN CREATE!");
 		this.game.updateEvent = new Phaser.Signal();

 		this.game.stage.backgroundColor = 0x444444;

        let earth = new Planet(this.game, {diameter:200, slots:7});
        earth.createPlanet();

		//this.game.add.existing(pallet);

        this.bmpText = this.game.add.bitmapText(10, 100, 'carrier_command','Drag me around !',34);
        this.bmpText.inputEnabled = true;
        
        let button = this.game.add.button(20, 20, 'button', this.actionOnClick, this, 2, 1, 0);
        button.input.enableDrag();

        let pallet = new Pallet({ game: this.game, x: this.game.world.centerX, y:this.game.world.centerY, key: 'sprite'});
    }
 
    update() {
    	this.game.updateEvent.dispatch();
 		//console.log("MAIN UPDATE!");
 		//this.pallet.update();
    }

    actionOnClick () {
        var blockSprite = this.game.add.sprite(150, 300, 'block');
         //  Input Enable the sprites
        blockSprite.inputEnabled = true;
        //  Allow dragging - the 'true' parameter will make the sprite snap to the center
        blockSprite.input.enableDrag(true);
    }
 
};

export default Main;