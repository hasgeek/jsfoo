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
}

extend(Grid.prototype, {
    add: function() {
        var els = flatten(slice.call(arguments, 0)),
            me = this.el,
            t = this;
        each(els, function(el) {
            if(el.parentNode !== me){
                me.appendChild(el);    
                t.faces.push(el);
            }

            
            // that's it, for now. 
            // todo - animation
        });
    },
    face: function(pos) {
        var el = doc.createElement('div');
        el.className = 'face';
        el.style.zIndex = 1;
        el.__iso__ = {};
        el.__iso__.dir = pos.dir || 'front';
        var coOrds = extend(iso.transform(null, null, pos.x, pos.y, pos.z), {
            transform: iso.face(pos.dir || 'front')
        });
        beam(el, coOrds);
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
        face.__iso__.dir = pos.dir || 'front';

        beam(face, extend(iso.transform(null, null, pos.x, pos.y, pos.z), {
            transform: iso.face(pos.dir || 'front')
        }));
        return this;
    }
});

Grid.each = each;
Grid.times = times;
Grid.extend = extend;
Grid.iso = iso;