var utils = {
	atanxy: function(x, y) {
		var angle = Math.atan2(y, x);
		if (angle < 0) angle = Math.PI * 2 + angle;
		return angle;
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
	},

	// line: percent is 0-1
	getLineXYatPercent: function(startPt,endPt,percent) {
	    var dx = endPt.x-startPt.x;
	    var dy = endPt.y-startPt.y;
	    var X = startPt.x + dx*percent;
	    var Y = startPt.y + dy*percent;
	    return( {x:X,y:Y} );
	},

	// line: distance
	getLineDistance: function(startPt,endPt) {
	    var dx = endPt.x-startPt.x;
	    var dy = endPt.y-startPt.y;
	    var dd = Math.sqrt( (dx*dx) + (dy*dy) );
	    return dd;
	},

	// quadratic bezier: percent is 0-1
	getQuadraticBezierXYatPercent: function(startPt,controlPt,endPt,percent) {
	    var x = Math.pow(1-percent,2) * startPt.x + 2 * (1-percent) * percent * controlPt.x + Math.pow(percent,2) * endPt.x; 
	    var y = Math.pow(1-percent,2) * startPt.y + 2 * (1-percent) * percent * controlPt.y + Math.pow(percent,2) * endPt.y; 
	    return( {x:x,y:y} );
	},

	// cubic bezier percent is 0-1
	getCubicBezierXYatPercent: function(startPt,controlPt1,controlPt2,endPt,percent){
	    var x=this.CubicN(percent,startPt.x,controlPt1.x,controlPt2.x,endPt.x);
	    var y=this.CubicN(percent,startPt.y,controlPt1.y,controlPt2.y,endPt.y);
	    return({x:x,y:y});
	},

	// cubic helper formula at percent distance
	CubicN: function(pct, a,b,c,d) {
	    var t2 = pct * pct;
	    var t3 = t2 * pct;
	    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct
	    + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct
	    + (c * 3 - c * 3 * pct) * t2
	    + d * t3;
	},

	/**
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	getRandomArbitrary: function(min, max) {
	    return Math.random() * (max - min) + min;
	},

	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	getRandomInt: function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	},
};


