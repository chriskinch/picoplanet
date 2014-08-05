(function( cq ) {

	CanvasQuery.Wrapper.prototype.closedcircle = function(x, y, r) {
		this.context.beginPath();
		this.context.arc(x, y, r, 0, Math.PI * 2);
		this.context.closePath();
		return this;
	}

}( CanvasQuery ));