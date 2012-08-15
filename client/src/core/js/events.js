jsfoo.add('events', function(foo) {
	" use strict";
	// leverage Backbone.Events? sure!
	foo.Events = Backbone.Events;
	
}, {
	uses: ['core']
});