var doc = document,
    win = window,
    jsfoo = require('jsfoo'),
    grid = jsfoo(doc.getElementById('boxes'), {
        side: 10,
        offset: {
            top: 500,
            left: 200

        }
    }),
    times = jsfoo.times,
    slice = [].slice,
    each = jsfoo.each,
    extend = jsfoo.extend,
    beam = jsfoo.beam;

function random(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
        rand = random(index++);
        shuffled[index - 1] = shuffled[rand];
        shuffled[rand] = value;
    });
    return shuffled;
}

function randPos(n) {
    n = n || 1;
    return ({
        x: Math.round(Math.random() * n),
        y: Math.round(Math.random() * n),
        z: Math.round(Math.random() * n)
    });;
}

function bunch(arr, n) {
    // segment an array into parts of size <= n
    n = n || 1;
    var result = [];
    for (var i = 0; i < arr.length / n; i++) {
        result.push(slice.call(arr, i * n, (i + 1) * n));
    }
    return result;

}



function step(grid) {
    // mess with the speeds of each face. 
    each(grid.faces, function(f) {
        f.__beam__.multiply(function() {
            return Math.max(0.01, Math.random() * 0.05);
        });

        f.__beam__.transformer.multiply(function() {
            return Math.max(0.01, Math.random() * 0.05);
        });
    });

    // take all the faces from the cube, shuffle them around, and make new cubes. 
    var sets = bunch(shuffle(grid.faces), 3);
    each(sets, function(set) {
        var pos = randPos(grid.side);
        each(['front', 'left', 'top'], function(o, i) {
            var to = extend({
                dir: o
            }, pos);
            grid.move(set[i], to);
            // todo - colormap
        });
    });
}

times(50, function(i) {
    grid.add(grid.cube(randPos(grid.side)));
});

// grid.add(grid.cube({x:0,y:0,z:0}));
// grid.add(grid.cube({x:0,y:1,z:0}));
// grid.add(grid.cube({x:0,y:2,z:0}));
// grid.add(grid.cube({x:0,y:3,z:0}));
// grid.add(grid.cube({x:0,y:4,z:0}));


setInterval(function() {
    step(grid);
}, 1300);