jsfoo().use('attr', 'config', function(foo) {
	"use strict";

	console.log(foo);

	// let's have fun with objects 
	// attribute classes 
	var x = new foo.Attr;

	x.on('all', function() {
		console.log(arguments);
	});

	x.set('a', 123); // set without describing
	x.describe('b', { // or describe beforehand
		value: 'xyz',
		validate: function(v) {
			return v % 2 === 0;
		}
	});

	console.log(x.get('c'));
	console.log(x.get('a'));
	console.log(x.get('b'));
	try {
		x.set('b', 21);
	} catch (e) {
		console.error(e);
	}


	// namespace
	foo.a = {
		x: 5
	};
	foo.namespace('a.b.c').d = 2;
	console.log(foo.a.b.c);


	// config
	foo.config.set('x.y.z', 123).debug().set('x.y', 'abc').debug();
	console.log(foo.config('x.y'));
	console.log(foo.config('does.not.exist'));


	// supporting cast - some underscore mods
	// _.times 
	// 1. regular loop
	_.times(4, function(i) {
		console.log(i);
	})

	// 2. pass an array as input. basically _.each, with reversed args
	var arr = ['aadvark', 'brontosauras', 'coelcanth'];
	_.times(arr, function(i, el) {
		console.log(arguments);
	});

	// 3. collect the results ala _.map
	var newArr = _.times(arr, function(i, el) {
		return el.toUpperCase()
	});
	console.log(newArr);

	// _.at, _.setAt, for 'jsonpath'-like traversing of objects. warning - perf.
	console.log(_({}).at('does.not.exist'));
	console.log(_.at(foo, 'a.b'));

	_(foo).setAt('a.e.i.o', 123);
	console.log(foo.a.e.i.o);



});