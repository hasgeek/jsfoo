(function() {
    // "glider gun" grid
    var gun = [{
        x: 1,
        y: 4
    }, {
        x: 1,
        y: 5
    }, {
        x: 2,
        y: 4
    }, {
        x: 2,
        y: 5
    }, {
        x: 11,
        y: 3
    }, {
        x: 11,
        y: 4
    }, {
        x: 11,
        y: 5
    }, {
        x: 12,
        y: 2
    }, {
        x: 12,
        y: 6
    }, {
        x: 13,
        y: 1
    }, {
        x: 13,
        y: 7
    }, {
        x: 14,
        y: 1
    }, {
        x: 14,
        y: 7
    }, {
        x: 15,
        y: 4
    }, {
        x: 16,
        y: 2
    }, {
        x: 16,
        y: 6
    }, {
        x: 17,
        y: 3
    }, {
        x: 17,
        y: 4
    }, {
        x: 17,
        y: 5
    }, {
        x: 18,
        y: 4
    }, {
        x: 21,
        y: 5
    }, {
        x: 21,
        y: 6
    }, {
        x: 21,
        y: 7
    }, {
        x: 22,
        y: 5
    }, {
        x: 22,
        y: 6
    }, {
        x: 22,
        y: 7
    }, {
        x: 23,
        y: 4
    }, {
        x: 23,
        y: 8
    }, {
        x: 25,
        y: 3
    }, {
        x: 25,
        y: 4
    }, {
        x: 25,
        y: 8
    }, {
        x: 25,
        y: 9
    }, {
        x: 35,
        y: 6
    }, {
        x: 35,
        y: 7
    }, {
        x: 36,
        y: 6
    }, {
        x: 36,
        y: 7
    }

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

                var cube = [];
                each(['front', 'top', 'left'], function(o) {
                    cube.push(grid.face({
                        x: pos.x,
                        y: pos.y,
                        z: 1,
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
        gol.at(gun[i].x, 20 + gun[i].y, true);
    }

    setInterval(function() {
        step();
    }, 400);

    grid.gol = gol;
    win.grid = grid;
    win.jsfoo = jsfoo;
    win.step = step;

})();