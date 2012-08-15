jsfoo.add('attr', function(foo) {
    "use strict";

    var Attr = function() {};

    _.extend(Attr.prototype, foo.Events, {

        describe: function(name, spec) {
            var t = this;
            var defaults = {
                value: null,
                valueFn: null,
                validate: function(value) {
                    return true;
                },
                setter: _.identity,
                getter: _.identity,
                lazy: false,
                readOnly: false,

                // "private"
                _value: null,
                _init: false
            };
            if (typeof name !== 'string') {
                _.each(name, function(v, k) {
                    t.describe(k, v);
                });
            }

            if (spec == null) {
                spec = {};
            }
            this._attrs = this._attrs || {};

            // var attr = this._attrs[name] = _.defaults(spec, defaults);
            var attr = this._attrs[name] = _.extend({}, defaults, spec);

            attr.startup = function() {
                if (!attr._init) {
                    attr._value = attr.valueFn ? attr.valueFn.apply(t) : attr.value;
                    attr._init = true;
                    t.trigger('attr:init', name);
                }
                return attr;
            };
            if (!attr.lazy) {
                attr.startup();
            }
            this.trigger('attr:describe', name, spec);
            return this;
        },

        get: function(key) {
            this._attrs = this._attrs || {};
            if (!this._attrs[key]) {
                this.describe(key);
            }
            var attr = this._attrs[key].startup();
            var value = attr.getter.call(this, attr._value);
            this.trigger('get', key, value);
            return value;
        },

        set: function(key, value) {
            this._attrs = this._attrs || {};
            if (!this._attrs[key]) {
                this.describe(key);
            }
            var attr = this._attrs[key].startup();
            if (attr.readOnly) {
                this.trigger('attr:fail', key);
                throw "attr:" + key + " is read only";
            }
            if (attr.validate.call(this, value)) {
                attr._value = attr.setter.call(this, value);
                this.trigger('set', key, attr._value, value);
            } else {
                this.trigger('attr:fail', key);
                throw "attr:" + key + " did not validate for value:" + value;
            }
            return this;

        }
    });

    foo.Attr = Attr;

}, {
    uses: ['core', 'events']
});