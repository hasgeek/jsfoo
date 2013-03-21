(function() {
    // "glider gun" grid
    var gun = [
        [1, 4],
        [1, 5],
        [2, 4],
        [2, 5],
        [11, 3],
        [11, 4],
        [11, 5],
        [12, 2],
        [12, 6],
        [13, 1],
        [13, 7],
        [14, 1],
        [14, 7],
        [15, 4],
        [16, 2],
        [16, 6],
        [17, 3],
        [17, 4],
        [17, 5],
        [18, 4],
        [21, 5],
        [21, 6],
        [21, 7],
        [22, 5],
        [22, 6],
        [22, 7],
        [23, 4],
        [23, 8],
        [25, 3],
        [25, 4],
        [25, 8],
        [25, 9],
        [35, 6],
        [35, 7],
        [36, 6],
        [36, 7]
    ];

    var doc = document,
        win = window,
        jsfoo = require('jsfoo'),
        grid = jsfoo(doc.getElementById('boxes'), {
            side: 70,
            offset: {
                top: 900,
                left: -170

            }
        }),
        times = jsfoo.times,
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

            var expr = Math.sqrt(((ax - x) * (ax - x)) + ((ay - y) * (ay - y))) - Math.sqrt(((bx - x) * (bx - x)) + ((by - y) * (by - y)));

            return -1 * expr;
        });
    }


    function step() {
        var added = gol.added.sort(function(a, b) {
            var expr = Math.sqrt(((a.x - 10) * (a.x - 10)) + ((a.y - 10) * (a.y - 10))) - Math.sqrt(((b.x - 10) * (b.x - 10)) + ((b.y - 10) * (b.y - 10)))
            return -1 * expr;

        });
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

                var cube = grid.cube({
                    x: pos.x,
                    y: pos.y,
                    z: 1
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
                // x: Math.round(Math.random() * grid.side),
                // y: Math.round(Math.random() * grid.side),

                x: parseInt(pieces[0], 10),
                y: parseInt(pieces[1], 10),
                z: -2,
                dir: f.getAttribute('face')
            });
            setTimeout(function() {
                // to prevent memory leak
                beam.instances.splice(beam.instances.indexOf(f.__beam__), 1);
                delete f.__beam__;

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
    // for (var i = 0; i < 50; i++) {
    //     var x = Math.ceil(Math.random() * grid.side);
    //     var y = Math.ceil(Math.random() * grid.side);
    //     gol.at(x, y, true);
    // }

    for (var i = 0; i < gun.length; i++) {
        gol.at(gun[i][0], 20 + gun[i][1], true);
    }

    times(70, function() {
        gol.step();
    });


    var init = false;


    setInterval(function() {
        if (!init) {
            each(gol.unchanged, function(pos) {
                var cube = grid.cube({
                    x: pos.x,
                    y: pos.y,
                    z: 1
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

            });
            init = true;

        }
        step();
    }, 400);

    grid.gol = gol;
    win.grid = grid;
    win.jsfoo = jsfoo;
    win.step = step;

})();