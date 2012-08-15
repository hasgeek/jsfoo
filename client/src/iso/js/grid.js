jsfoo.add('iso-grid', function(foo){
	var attrs = {
		el: {
			getter: function() {
                return this.el;
            },
            setter: function(v) {
                this.el = $(v).get(0);
                $(this.el).addClass('iso-grid');
                return this.el;
            }
		}
	};
	
	var Grid = foo.View.extend({
		initialize: function(){
			this.describe(attrs);
			foo.View.prototype.initialize.apply(this, arguments);
			this.faces = [];
		},
		// el isn't really used here. this is used to hold all the faces/arbits/etc
		face: function(options){
			options = _.defaults({}, options || {}, { el:document.createElement('div') });
			
			var face = new foo.iso.Face(_.isElement(options)? {el: options} : options );
			face.render();
			this.faces.push(face);
			this.el.appendChild(face.el);
			return this;
		},
		cube: function(options){
			var t = this;
			var offset = {
				left: $(document.body).width()/2,
				top: $(document.body).height()/2 
			};
			_.each(['front', 'back', 'top', 'bottom', 'left', 'right'], function(f){
				var opts  = _.defaults({}, options || {}, { 
					el : document.createElement('div'), 
					type: f,
					offset: offset
				});
				var face = new foo.iso.Face(opts);
				face.render();
				t.faces.push(face);
				t.el.appendChild(face.el);
			});
			return this;
		}
	});

	foo.namespace('iso').Grid = Grid;
},{uses:['iso-face']});