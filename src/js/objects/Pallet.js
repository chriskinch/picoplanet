
class Pallet {
    constructor ({ game, x, y, asset }){
        this.game = game;
        this.max;
        this.angle = { min: 0, max: 0 };
        this.graphics;
        this.graphics = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);

        this.game.input.onDown.add(function() {
            //console.log(this);
            this.game.updateEvent.add(this.update, this);
            this.createPallet();
        }.bind(this));

        this.game.input.onUp.add(function() {
            //console.log(this);
            this.destroyPallet();
        }.bind(this));
    }

    createPallet() {
        this.max = 361;
        this.tween = this.game.add.tween(this.angle).to( { max: this.max }, 300, "Linear", true, 0, 0, false);
    }

    destroyPallet() {
        this.max = 0;
        this.tween = this.game.add.tween(this.angle).to( { max: this.max }, 300, "Linear", true, 0, 0, false);
        this.tween.onComplete.add(this.killUpdate, this);
    }

    update(){
        this.graphics.clear();
        this.graphics.lineStyle(30, 0xffd9cc);
        this.graphics.arc(0, 0, 135, this.game.math.degToRad(this.angle.min), this.game.math.degToRad(this.angle.max), false);
    }

    killUpdate(){
        console.log(this.max);
        if(this.max == 0) {
            this.game.updateEvent.remove(this.update, this);
            this.graphics.clear();
        }
    }
}

export default Pallet;