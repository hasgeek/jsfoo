jsfoo.add('util', function(foo) {
    "use strict";

    // some underscore mods
    _.mixin({

        isValue: function(o) {
            return o != null; // true for undefined/ null, false for anything else
        },

        times: function(n, fn) {
            // combination forloop / map. 
            // compatible with regular _.times
            // WARNING - fn is called with (index, value), not the other (regular) way around
            var times = _.isArray(n) ? n.length : n;
            var arr = _.isArray(n) ? n : [];
            var ret = [];

            for (var i = 0; i < times; i++) {
                ret.push(fn(i, arr[i]));
            }
            return ret;

        },

        at: function(o, path) {
            // _(x).at('a.b.c') === x.a.b.c || undefined, if any of the subpaths don't exist
            var pointer = o;
            var failed = false;
            if (!path) {
                return o;
            }
            _.each(path.split('.'), function(p) {
                if (_.isValue(pointer[p]) && !failed) {
                    pointer = pointer[p];
                } else {
                    failed = true;
                }
            });
            return failed ? undefined : pointer;
        },

        setAt: function(o, key, value) {
            // _(x).setAt('a.b.c', 2) -> x.a.b.c === 2, WITHOUT overriding .a .b if they exist
            if (typeof key === 'string') {
                var path = key.split('.');
                var node = o || {};
                _.times(path.length - 1, function(i) {
                    var _node = node[path[i]];
                    if (!_.isValue(_node)) {
                        _node = node[path[i]] = {};
                    }
                    node = _node;
                });

                node[path[path.length - 1]] = value;
            } else {
                //setting object hash by deepcopy
                _.each(_._paths(key), function(p, i) {
                    _.setAt(o, p.key, p.value);
                });
            }
            return o;
        },

        _paths: function(o) {
            // enumerate json paths to all leaves
            // todo - optimize
            var paths = [];
            _.each(_.keys(o), function(k) {
                var _t = typeof o[k];
                // check for primitives and arrays
                // todo - oh god this could be so much cleaner. 
                // perhaps - _.isArray(x) || !_.isObject(x)
                if ((!_.isValue(o[k])) || _t === 'string' || _t === 'number' || _.isArray(o[k]) || _t === 'boolean') {
                    paths.push({
                        key: k,
                        value: o[k]
                    });
                    return;
                } else {
                    var childPaths = _._paths(o[k]);
                    paths = paths.concat(_.times(childPaths, function(i, p) {
                        return ({
                            key: k + '.' + p.key,
                            value: p.value
                        });
                    }));
                }

            });
            return paths;

        }
    });

    foo.util = {}; // perhaps unnecessary? we shall see. 


}, {
    uses: ['core']
});