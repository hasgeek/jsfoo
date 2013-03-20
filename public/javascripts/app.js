var doc = document,
    win = window,
    jsfoo = require('jsfoo'),
    grid = jsfoo(doc.getElementById('boxes'), {
        side: 15,
        offset: {
            top: 600,
            left: 200

        }
    }),
    times = jsfoo.times,
    slice = [].slice,
    each = jsfoo.each,
    extend = jsfoo.extend,
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
        z: 0 //Math.round(Math.random() * n)
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



// function step(grid) {
//     // mess with the speeds of each face. 

//     each(grid.faces, function(f) {
//         f.__beam__.multiply(function() {
//             return Math.max(0.003, Math.random() * 0.01);
//         });

//         f.__beam__.transformer.multiply(function() {
//             return Math.max(0.003, Math.random() * 0.01);
//         });
//     });

//     // take all the faces from the cube, shuffle them around, and make new cubes. 
//     var sets = bunch(shuffle(grid.faces), 3);
//     each(sets, function(set) {
//         var pos = randPos(grid.side);
//         each(['front', 'left', 'top'], function(o, i) {
//             var to = extend({
//                 dir: o
//             }, pos);
//             grid.move(set[i], to);
//         });
//     });
// }

// times(20, function(i) {
//     grid.add(grid.cube(randPos(grid.side)));
// });


// setInterval(function() {
//     step(grid);
// }, 2000);



var gol = require('threepointone-game-of-life/index.js')({
    width: 50,
    height: 50
});
function closest(arr, x, y) {
    
    return arr.sort(function(a, b) {
        var axyz = a.getAttribute('x:y:z').split(':');
        var bxyz = b.getAttribute('x:y:z').split(':');

        var ax = parseInt(axyz[0],10),
            ay = parseInt(axyz[1],10);
            // az = parseInt(axyz[2],10);
        var bx = parseInt(bxyz[0],10),
            by = parseInt(bxyz[1],10);
            // bz = bxyz[2];


        var expr = (((ax - x) * (ax - x)) + ((ay - y) * (ay - y))) - ( ((bx - x) * (bx - x)) + ((by - y) * (by - y)))
            

        return -1*expr;
    });
}


function step() {

    // var added = gol.added;
    // var removed = gol.removed;

    // get an array of positions
    // var arr = require('threepointone-flatten/index.js')(gol.grid);
    var result = [];
    each(gol.grid, function(row, j) {
        each(row, function(el, i) {
            result.push({
                x: i,
                y: j
            })
        });
    });

    // each(grid.faces, function(f) {
    //     f.__beam__.multiply(function() {
    //         return Math.max(0.001, Math.random() * 0.05);
    //     });

    //     f.__beam__.transformer.multiply(function() {
    //         return Math.max(0.001, Math.random() * 0.05);
    //     });
    // });


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
                var f = faces[faces.length-1 -i];
                grid.move(f, {
                    x: pos.x,
                    y: pos.y,
                    z: 0,
                    dir: o
                });
                pool = without(pool, f);
            });
        } else {

            // var cube = grid.cube({
            //     x: pos.x - 1,
            //     y: pos.y - 1 ,
            //     z: -5
            // });
            var cube = [];
            each(['front', 'top', 'left'], function(o){
                cube.push(grid.face({
                    x: Math.round(Math.random()*grid.side),
                    y: Math.round(Math.random()*grid.side),
                    z: 0,
                    dir:o
                }));
            });

            // var cube = grid.cube({
            //     x: Math.round(Math.random()*grid.side),
            //     y: Math.round(Math.random()*grid.side),
            //     z: 10
            // });
    
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
            x: Math.round(Math.random()*grid.side),
            y: Math.round(Math.random()*grid.side),

            // x: parseInt(pieces[0],10),
            // y: parseInt(pieces[1],10),
            z: 3,
            dir: f.getAttribute('face')
        });
        setTimeout(function(){
            if(f.parentNode){
                f.parentNode.removeChild(f);
            }
        },3000);


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
    // grid.add(grid.cube({
    //     x: x,
    //     y: y,
    //     z: 0
    // }));
}

// gol.step();
setInterval(function() {
    step();
}, 1200);
// document.body.addEventListener('click', function() {
//     step();
// });