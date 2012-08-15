jsfoo.add('iso-face', function(foo) {
    "use strict";

    // oh god what is this 
    var sqDiff = _.memoize(function(x, y) {
        return Math.pow(x, 2) - Math.pow(y, 2);
    }, function(x, y) {
        return x + ':' + y;
    });
    
    var sqrt = _.memoize(function(n) {
        return Math.sqrt(n);
    });

    var types = {
        front:  { cls: 'front' },
        back:   { cls: 'back' },
        top:    { cls: 'top' },
        bottom: { cls: 'bottom' },
        left:   { cls: 'left' },
        right:  { cls: 'right' }
    };


    var attrs = {
        el: {
            getter: function() {
                return this.el;
            },
            setter: function(v) {
                this.el = $(v).get(0);
                return this.el;
            }
        },
        x: { value: 0 },
        y: { value: 0 },
        z: { value: 0 },
        position: {
            getter: function() {
                return this._position();
            }
        },
        type: {
            validate: function(v) {
                return (_.indexOf(_.keys(types), v) >= 0);
            },
            value: 'front',
            setter: function(v) {
                $(this.get('el')).removeClass(this.get('type')).addClass(v);
                return v;
            }
        },
        pxlen: { value: 24 },
        speed: { value: 100 },
        offset: {
            value: {
                top: 200,
                left: 200
            }
        }

    };


    var Face = foo.View.extend({
        initialize: function(config) {
            this.describe(attrs);
            foo.View.prototype.initialize.apply(this, arguments);

        },
        destroy: function() {
            foo.View.prototype.destroy.apply(this, arguments);
        },
        to: function(options, callback) {
            this.trigger('to', options);
            if(this.anim){
                this.anim.stop(true);
            }
            var p = this._position(options);
            var duration = this.get('speed') * p.distance;

            var dest = this._position(options);

            if (options.type) {
                this.set('type', options.type);
            }            

            var t = this;
            this.anim = foo.tweener(this.el, {
                left: dest.left,
                top: dest.top,
                zIndex: dest.zIndex,
                duration: dest.distance*200,
                // duration:1000,
                easing: easings.sinusoidal,
                complete: function() {                                        
                    t.set('x', _.isValue(options.x)?options.x: t.get('x'));
                    t.set('y', _.isValue(options.y)?options.y: t.get('y'));
                    t.set('z', _.isValue(options.z)?options.z: t.get('z'));
                    
                    if (_.isFunction(callback)) {                        
                        if(t.anim){
                            this.anim.stop();
                        }
                        callback();
                    }
                }
            });            
        },
        _position: function(options) {
            options = options || {};
            var current = {
                x: this.get('x'),
                y: this.get('y'),
                z: this.get('z')

            };
            options = _.extend({}, current, options);

            var pxlen = this.get('pxlen');
            var type = types[this.get('type')];

            var height = 33; 

            var left = (options.x - options.y) * pxlen;
            var top = ((options.x + options.y) * pxlen * 0.6) + (options.z * height);
            var offset = this.get('offset');

            

            var sqSum = function(vector) {
                    return sqDiff(options[vector], current[vector]);
                };

            return {
                top: offset.top - top,
                left: offset.left + left,
                distance: sqrt(sqSum('x') + sqSum('y') + sqSum('z')),
                zIndex: Math.round(1000 + (1000 * options.z) - ((options.x + options.y)))

            };

        },
        render: function() {
            var p = this._position();
            var type = this.get('type');
            $(this.el).addClass('iso-face').addClass(this.get('type')).addClass(foo.config('iso.theme', 'blue'));

            $(this.get('el')).css({
                top: p.top,
                left: p.left,
                zIndex: p.zIndex
            });
            this.trigger('render');
        }

    });


    foo.namespace('iso').Face = Face;

}, {
    uses: ['view', 'tween', 'config']
});