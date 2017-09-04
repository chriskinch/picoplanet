
class Pallet {
    constructor ({ game, x, y, asset }){
        this.game = game;
        // this.max;
        this.angle = { min: 0, max: 0 };
        // this.graphics;
        
        
        // this.max = 360;
        // this.graphics = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY); 
        // this.graphics.lineStyle(30, 0xffd9cc);

        // this.game.add.tween(this.angle).to( { max: this.max }, 300, "Linear", true, 0, 0, false); 
        console.log(this.game.updateEvent);
        this.game.updateEvent.add(this.update, this);
    }



    // createPallet() {
    //     console.log(this.game);
    //     this.max = 360;
    //     this.graphics = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY); 
    //     this.graphics.lineStyle(30, 0xffd9cc);

    //     this.game.add.tween(this.angle).to( { max: this.max }, 300, "Linear", true, 0, 0, false);
    //     window.requestAnimationFrame(this.update.bind(this));

        
    // }

    // destroyPallet() {
    //     this.max = 0;
    //     this.game.add.tween(this.angle).to( { max: this.max }, 300, "Linear", true, 0, 0, false);
    //     window.requestAnimationFrame(this.update.bind(this));
    // }

    update(){
        console.log(this.angle);
        //this.graphics.arc(0, 0, 135, this.game.math.degToRad(this.angle.min), this.game.math.degToRad(this.angle.max), false);
        // if(this.angle.max < 360) {
        //     window.requestAnimationFrame(this.update.bind(this));
        // }
    }
}

export default Pallet;