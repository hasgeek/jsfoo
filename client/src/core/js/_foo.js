(function(ctx) {
    "use strict";
    var root = this;

    var previousFoo = root.foo;

    function Foo(config) {
        this.config = _.defaults({}, config || {}, { /* todo - defaults hash */
            // intl, theme, that sort of thing
        });
        this._modules = this.config._modules || foo._modules || {}; // available module definitions
        this._attached = []; // already attached to this instance
    }

    _.extend(Foo.prototype, {
        use: function() {
            var t = this,
                args = _.toArray(arguments),
                last = _.last(args),
                // possible callback
                fn = _.isFunction(last) ? last : _.i,
                modules = _.isFunction(last) ? _.initial(args) : args,

                // use to calculate dependencies
                deps = [],
                _deps = [];

            function resolve(name) {
                if (_.indexOf(_deps, name) >= 0) {
                    return;
                    // no op, already parsed
                } else {
                    // use _deps as comparison because deps should get updated only AFTER a a module is reolved. 
                    _deps.push(name);
                    var uses = t._modules[name].options.uses || [];
                    if (!_.isArray(uses)) {
                        uses = [uses];
                    }
                    _.each(uses, function(u) {
                        resolve(u);
                    });
                    deps.push(name);
                }
            }

            // recursively update deps with required modules
            _.each(modules, function(m) {
                resolve(m);
            });

            _.each(deps, function(d) {
                if (_.indexOf(t._attached, d) >= 0) {
                    return;
                } else {
                    t._modules[d].fn(t);
                    t._attached.push(d);
                }
            });
            fn(this); //todo - scope?
            return this;


        },
        root:ctx 
    });

    var foo = function(config) {
            return new Foo(config);
        };

    _.extend(foo, {
        add: function(name, fn, options) {
            this._modules = this._modules || {};
            this._modules[name] = {
                name: name,
                fn: fn || _.i,
                options: options || {}
            };
        },
        noConflict: function() {
            root.jsfoo = previousFoo;
            return this;
        },
        root: ctx
    });

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = jsfoo;
        }
        exports.jsfoo = jsfoo;
    } else {
        root['jsfoo'] = foo;
    }


}.call(this));