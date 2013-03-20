(function() {
    var doc = document,
        win = window,
        jsfoo = require('jsfoo'),
        grid = jsfoo(doc.getElementById('boxes'), {
            side: 15,
            offset: {
                top: 400,
                left: 120

            }
        }),
        slice = [].slice,
        each = jsfoo.each,
        beam = jsfoo.beam;

    function filter(arr, fn) {
        var result = [];
        each(arr, function(el, i) {
            if (fn(el)) {
                result.push(el);
            }
        });
        return result;
    }

    function without(arr, el) {
        var result = [];
        each(arr, function(e) {
            if (e !== el) result.push(e);
        });
        return result;
    }



    var gol = require('threepointone-game-of-life/index.js')({
        width: 50,
        height: 50
    });

    function closest(arr, x, y) {

        return arr.sort(function(a, b) {
            var axyz = a.getAttribute('x:y:z').split(':');
            var bxyz = b.getAttribute('x:y:z').split(':');

            var ax = parseInt(axyz[0], 10),
                ay = parseInt(axyz[1], 10);
            var bx = parseInt(bxyz[0], 10),
                by = parseInt(bxyz[1], 10);

            var expr = (((ax - x) * (ax - x)) + ((ay - y) * (ay - y))) - (((bx - x) * (bx - x)) + ((by - y) * (by - y)))


            return -1 * expr;
        });
    }


    function step() {

        var result = [];
        each(gol.grid, function(row, j) {
            each(row, function(el, i) {
                result.push({
                    x: i,
                    y: j
                })
            });
        });


        var added = gol.added;
        var removed = gol.removed;

        var pool = [];
        each(removed, function(pos) {
            var faces = filter(grid.faces, function(f) {
                return f.getAttribute('x:y:z') === [pos.x, pos.y, 0].join(':')
            });
            pool = pool.concat(faces);
        });

        each(added, function(pos) {
            if (pool.length > 0) {
                var faces = closest(pool, pos.x, pos.y);
                each(['front', 'left', 'top'], function(o, i) {
                    var f = faces[faces.length - 1 - i];
                    grid.move(f, {
                        x: pos.x,
                        y: pos.y,
                        z: 0,
                        dir: o
                    });
                    pool = without(pool, f);
                });
            } else {

                var cube = [];
                each(['front', 'top', 'left'], function(o) {
                    cube.push(grid.face({
                        x: Math.round(Math.random() * grid.side),
                        y: Math.round(Math.random() * grid.side),
                        z: 0,
                        dir: o
                    }));
                });

                grid.add(cube);
                each(cube, function(f) {
                    grid.move(f, {
                        x: pos.x,
                        y: pos.y,
                        z: 0,
                        dir: f.getAttribute('face')
                    });

                });
            }
        });

        each(pool, function(f) {
            var pieces = f.getAttribute('x:y:z').split(':');
            grid.move(f, {
                x: Math.round(Math.random() * grid.side),
                y: Math.round(Math.random() * grid.side),

                // x: parseInt(pieces[0],10),
                // y: parseInt(pieces[1],10),
                z: 3,
                dir: f.getAttribute('face')
            });
            setTimeout(function() {
                if (f.parentNode) {
                    f.parentNode.removeChild(f);
                }
            }, 3000);


            beam(f, {
                opacity: 0
            });
            grid.faces = without(grid.faces, f);
        });

        gol.step();

    }


    // prepopulate some cells with live state
    for (var i = 0; i < 50; i++) {
        var x = Math.ceil(Math.random() * grid.side);
        var y = Math.ceil(Math.random() * grid.side);
        gol.at(x, y, true);
    }

    setInterval(function() {
        step();
    }, 1000);

    grid.gol = gol;
    win.grid = grid;
    win.jsfoo = jsfoo;
    
})();