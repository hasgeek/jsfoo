jsfoo.add('view', function(foo){ 
    var attrs = {

    };

    var View = Backbone.View.extend({
        initialize: function(config){
            var t = this; 
            config = config || {};
            _.each(config, function(v, k){                
                t.set(k, v); 
            });
        },
        destroy: function(){
            // todo - destroy element, etc
        },
        render: function(){

        }
    });

    _.extend(View.prototype, foo.Attr.prototype);

    foo.View = View;

}, {uses:['attr']}); 