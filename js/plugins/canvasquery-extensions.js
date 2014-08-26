(function( cq ) {

	CanvasQuery.Wrapper.prototype.closedcircle = function(x, y, r) {
		this.context.beginPath();
		this.context.arc(x, y, r, 0, Math.PI * 2);
		this.context.closePath();
		return this;
	}

	CanvasQuery.Wrapper.prototype.roundRect = function(x, y, width, height, radius) {
		if (typeof radius === "undefined") {
			radius = 5;
		}
		this.context.beginPath();
		this.context.moveTo(x + radius, y);
		this.context.lineTo(x + width - radius, y);
		this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
		this.context.lineTo(x + width, y + height - radius);
		this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		this.context.lineTo(x + radius, y + height);
		this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
		this.context.lineTo(x, y + radius);
		this.context.quadraticCurveTo(x, y, x + radius, y);
		this.context.closePath();
		return this;
	}

}( CanvasQuery ));