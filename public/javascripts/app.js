var doc = document,
    win = window,
    jsfoo = require('jsfoo'),
    grid = jsfoo(doc.getElementById('boxes'), {
        side: 10
    }),
    times = jsfoo.times,
    slice = [].slice,
    each = jsfoo.each,
    extend = jsfoo.extend;

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
        z: 0
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
            return Math.max(0.005, Math.random() * 0.01);
        });

        f.__beam__.transformer.multiply(function() {
            return Math.max(0.005, Math.random() * 0.01);
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

times(20, function(i) {
    grid.add(grid.cube(randPos(grid.side)));
});


setInterval(function() {
    step(grid);
}, 1000);