_.mixin({
	filterByPath: function(list, string){
		var filter = [];
		_.each(list, function(val, key){
			if(_.getPath(val, string) == true) {
				filter.push(val);
			}
		});
		return filter;
	},
});