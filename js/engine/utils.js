var utils = {
	atanxy: function(x, y) {
		var angle = Math.atan2(y, x);
		if (angle < 0) angle = Math.PI * 2 + angle;
		return angle;
	},

	hasArrayItem: function(array, string) {
		//console.log(array);
		var index = array.indexOf(string);
		if(index > -1) return true;
	},

	setArrayItem: function(array, string, state) {
		var index = array.indexOf(string);
		if(index == -1 && state === true) array.push(string);
		if(index > -1 && state === false) array.splice(index, 1);
		return array;
	},

	arrangeToArc: function(array, target) {
		var radius = target.radius;
		var angle = (360/array.length) * (Math.PI/180);

		_.each(array, function(value, key){
		  var segment = angle*key;
		  var x = Math.cos(segment) * target.radius;
		  var y = Math.sin(segment) * target.radius;
		  value.x = target.x + x;
		  value.y = target.y + y;
		});
	}

};
