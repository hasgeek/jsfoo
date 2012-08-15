jsfoo.add('core', function(foo) {
    "use strict";
    _.extend(foo, {
        namespace: function(path) {
            path = path.split('.');
            var ptr = foo;
            _.each(path, function(p) {
                if (ptr[p] == null) {
                    ptr[p] = {};
                }
                ptr = ptr[p];
            });
            return ptr;
        }
    });

    // inheritance
    // from the default coffeescript, replaced __super__ with superclass
    var __hasProp = {}.hasOwnProperty;
    _.mixin({
        inherits: function(child, parent, iprops, sprops) {
            
            for (var key in parent) {
                if (__hasProp.call(parent, key)) {
                    child[key] = parent[key];
                }
            }

            function Ctor() {
                this.constructor = child;
            }
            Ctor.prototype = parent.prototype;
            child.prototype = new Ctor();
            child.superclass = parent.prototype; // todo - argue. 
            
            _.extend(child, sprops);
            _.extend(child.prototype, iprops);

            return child;
        }
    });

});