var utils = {
	atanxy: function(x, y) {
		var angle = Math.atan2(y, x);
		if (angle < 0) angle = Math.PI * 2 + angle;
		return angle;
	},

	/*
	 * Checks if the mouse is over a certain entity.
	 */
	contains: function(x, y, entity) {
		var width = (arguments[3].length > 1) ? arguments[3][0]/2 : arguments[3][0],
			height = (arguments[3].length > 1) ? arguments[3][1]/2 : arguments[3][0],
			box = [entity.x-width, entity.x+width, entity.y-height, entity.y+height];

		if(box && x >= box[0] && x <= box[1] && y >= box[2] && y <= box[3]) {
			return true;
		} 
	}, 

	hover: function(entity, x, y) {
		var box = [entity.x-entity.width/2, entity.x+entity.width/2, entity.y-entity.height/2, entity.y+entity.height/2];
		var hit = (box && x >= box[0] && x <= box[1] && y >= box[2] && y <= box[3]) ? true : false;
		entity.mouseover = hit;
	}
};
