jsfoo.add('config', function(foo) {
    "use strict";
    // namespaced configs for AFTER foo + deps has loaded. 
    var config = {};

    foo.config = function(key, _default) {
        var val = _(config).at(key);
        return (_.isValue(val) ? val : _default);
    };

    _.extend(foo.config, {
        set: function(path, value) {
            _(config).setAt(path, value);
            return this;
        },
        debug: function() {
            _.each(_._paths(config), function(p) {
                console.log(p.key, p.value);
            });
            return this;
        }
    });


}, {
    uses: ['util']
});