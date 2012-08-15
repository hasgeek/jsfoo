var x = jsfoo().use('iso-grid', function(foo){
    
    var grid = new foo.iso.Grid({
        el: '#my-grid'
    });


    _.each([[0, -5, 0],
    [1, -5, 0],
    [2, -5, 0],
    [0, -5, 1],
    [0, -5, 2],
    [1, -5, 2],
    [2, -5, 2],
    [2, -5, 1]], function(vec){
        grid.cube({
            x:vec[0],
            y: vec[1],
            z: vec[2]
        });
    });

});




var x = jsfoo().use('iso-grid', function(foo) {
    var grid = new foo.iso.Grid({
        el: '#my-grid'
    });

    var randXYZ = function() {
            return {
                x: Math.round(Math.random() * 8),
                y: Math.round(Math.random() * 8),
                // z: -5 + Math.round(Math.random() * 3)
                z: 0
            };
        };
    
    _.times(20, function() {
        grid.cube(randXYZ());
    })
    
    var fronts = _.filter(grid.faces, function(f) {
        return f.get('type') === 'front';
    });
    var lefts = _.filter(grid.faces, function(f) {
        return f.get('type') === 'left';
    });
    var tops = _.filter(grid.faces, function(f) {
        return f.get('type') === 'top';
    });



    var inter;
    var run = function() {
            // var shuffled = [_.shuffle(fronts), _.shuffle(lefts), _.shuffle(tops)];
            var shuffled = [fronts, lefts, tops];

            _.times(fronts.length, function(i) {
                var pos = randXYZ();                
                var order = _.shuffle(['front', 'left', 'top']);
                // var order = ['front', 'left', 'top'];

                shuffled[0][i].to(_.extend({}, pos, {
                    type: order[0]
                }));
                shuffled[1][i].to(_.extend({}, pos, {
                    type: order[1]
                }));
                shuffled[2][i].to(_.extend({}, pos, {
                    type: order[2]
                }));
            });
        }

    foo.start = function() {
        inter = setInterval(run, 2000);
        run();
    };

    foo.start();
    var running = true;
    $('.iso-grid').on('click', function() {
        if (running) {
            _.each(grid.faces, function(f) {
                console.log('stopping');
                if (f.anim) {
                    f.anim.stop();
                }
                inter && clearInterval(inter);
                running = false;
            });
        } else {
            foo.start();
            running = true;
        }

    });    
});

console.log(x);