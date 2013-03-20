module.exports = Grid;

var slice = [].slice,
    beam = require('beam'),
    each = require('each'),
    extend = require('extend'),
    iso = require('iso'),
    times = require('times'),
    flatten = require('flatten'),
    doc = document;


function Grid(el, options) {
    if (!(this instanceof Grid)) return new Grid(el, options);
    this.el = el || document.body;
    options = options || {};
    this.side = options.side || 10;
    this.faces = [];
    this.offset = options.offset || 0;

    this.colorMap = {
        front: '#444444',
        left: '#222222',
        top: '#777777'
    };

}

extend(Grid.prototype, {
    add: function() {
        var els = flatten(slice.call(arguments, 0)),
            me = this.el,
            t = this;
        each(els, function(el) {
            if (el.parentNode !== me) {
                me.appendChild(el);
                t.faces.push(el);
            }
        });
    },
    face: function(pos) {
        var el = doc.createElement('div');
        el.className = 'face';
        el.style.zIndex = 1;
        el.style.opacity = 0;

        el.style.backgroundColor = '#000';

        var dir = pos.dir || 'front';
        var coOrds = extend({
            backgroundColor: this.colorMap[dir]
        }, iso.transform(null, null, pos.x, pos.y, pos.z, this.offset), {
            transform: iso.face(dir),
            opacity: 1
        });
        el.setAttribute('face', dir);
        el.setAttribute('x:y:z', [pos.x, pos.y, pos.z].join(':'));

        beam(el, coOrds);

        el.__beam__.multiply(0.005);

        el.__beam__.transformer.multiply(0.005);
        return el;

    },
    cube: function(pos) {
        var t = this;
        return times(['front', 'left', 'top'], function(i, face) {
            return t.face(extend({
                dir: face
            }, pos));
        });
    },
    move: function(face, pos) {
        var dir = pos.dir || 'front';

        var coOrds = extend({
            backgroundColor: this.colorMap[dir]
        }, iso.transform(null, null, pos.x, pos.y, pos.z, this.offset), {
            transform: iso.face(dir)
        });

        beam(face, coOrds);


        face.setAttribute('face', dir);
        face.setAttribute('x:y:z', [pos.x, pos.y, pos.z].join(':'));
        return this;
    }
});

Grid.each = each;
Grid.times = times;
Grid.extend = extend;
Grid.iso = iso;
Grid.beam = beam;