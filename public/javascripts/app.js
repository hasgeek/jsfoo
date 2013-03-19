var doc = document,
    win = window,
    grid = require('jsfoo')(doc.getElementById('boxes'), {
        side: 10
    }),
    times = require('jsfoo').times,
    slice = [].slice,
    each = require('jsfoo').each,
    extend = require('jsfoo').extend;

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

    times(10, function(i) {
        grid.add(grid.cube(randPos(grid.side)));
    });

    each(grid.faces, function(f){
        // f.__beam__.multiply(function(){
        //     return Math.random()*0.005
        // });

        // f.__beam__.transformer.multiply(function(){
        //     return Math.random()*0.005
        // });
    });

    function bunch(arr, n) {
        n = n || 1;
        var result = [];
        for (var i = 0; i < arr.length / n; i++) {
            result.push(slice.call(arr, i * n, (i + 1) * n));
        }
        return result;

    }

    function step(grid) {
        // take all the faces from the cube, shuffle them around, and make new cubes. 
        var sets = bunch(shuffle(grid.faces), 3);
        console.log(sets)
        each(sets, function(set) {
            var pos = randPos(grid.side);
            each(['front', 'left', 'top'], function(o, i) {
                var to = extend({
                    dir: o
                }, pos);
                grid.move(set[i], to);
            });
        });
    }

    // setInterval(function() {
        step(grid);
    // }, 3000);