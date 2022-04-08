// Templates
const captcha = (txt) => txt === prompt(`Type \`${txt}\` to continue`);
const goHomepage = () => location.href = 'index.html';
const get_GET = k => url_obj.searchParams.get(k);
const preload = u => new Image().src = u;

const arrCoords = obj => [obj.lat(), obj.lng()];
const coordsLink = arr => 'https://www.google.com/maps/place/' + arr;
const readDist = d => d > 1000 ? (d / 1000).toFixed(2) + 'km' : ~~d + 'm';
const readPrc = a => (a * 100).toFixedDown(2) + '%';
const readDate = ts => new Date(ts).toISOString().split('T')[0];
const readTime = s => {
    if (s == Infinity) s = 0;
    const _norm = n => n < 10 ? '0' + n : n;
    const
        _sec = _norm(s % 60),
        _min = _norm(~~(s / 60) % 60),
        _hr = _norm(~~(s / 3600));
    return `${ _hr }:${ _min }:${ _sec }`;
};

const b0 = n => n > 0 ? n : 0;
const calcAcc = d => b0(1 - d / (natural.EC / 4));
const calcPts = (a, t) => Math.floor(a * (1 / (1 + t / gameValue.ptsSecDiv)) * gameValue.maxPts);

// Functions
function range(a, b, step = 1) {
    if (b === undefined) [a, b] = [0, a];

    let arr = [];
    for (let i = a; step > 0 ? i < b : i > b; i += step) arr.push(i);

    return arr;
}
function geoDist(coords1, coords2) { // Thx https://www.movable-type.co.uk/scripts/latlong.html
    const [ lat1, lng1 ] = coords1;
    const [ lat2, lng2 ] = coords2;

    let f1 = lat1 * Math.PI / 180;
    let f2 = lat2 * Math.PI / 180;
    let df = (lat2 - lat1) * Math.PI / 180;
    let dg = (lng2 - lng1) * Math.PI / 180;

    let a = Math.sin(df / 2) * Math.sin(df / 2) +
        Math.cos(f1) * Math.cos(f2) *
        Math.sin(dg / 2) * Math.sin(dg / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return natural.ER * c; // Distance in meters
}
function genPass(len) {
    let pass = '';

    const chars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789';
    for (let i of range(len)) {
        pass += chars[~~(Math.random() * chars.length)];
    }

    return pass;
}

// Extend
String.prototype.allIndexOf = function (c) {
    let pos = [];

    let i = -1;
    while (i < this.length) {
        i = this.indexOf(c, i + 1);
        if (i == -1) break;
        pos.push(i);
    }

    return pos;
}
String.prototype.cut = function (len) {
    return (len < 0 || this.length <= len) ? ''+this : this.slice(0, len) + '…';
}
String.prototype.capitalize = function (every = true) {
    const _cw = w => w.charAt(0).toUpperCase() + w.slice(1);
    const words = this.split(/\s+|\n+/g);
    return every
        ? words.map(_cw).join(' ')
        : [_cw(words[0]), ...words.slice(1)].join(' ');
}

Number.prototype.toFixedDown = function (n) {
    let power = Math.pow(10, n);
    return Math.floor(this * power) / power;
};
$.fn.bem = function (filters) {
    /*
    * Filters a collection of DOM nodes by BEM parts.
    * Arguments (filters:array[*filter:object{ b?:string, e?:string, m?:string, mv?:string }]);
    * Returns (jQuery[]);
    * Documentation: ...js/_common/_bem-filter-documentation.txt
    */

    /* TODO: I had no time, so this is a task for other developers
        I want you to add this feature...
        If you write `!` before a filter keyword, the node that matches this keyword will be instantly ignored.
        |
        For example:
        { b: 'myBlock' } // without `!`, so we search nodes that MATCH the block `myBlock`
        { b: '!myBlock' } // with `!`, so we search nodes that DON'T match the block `myBlock`
        |
        Another:
        { b: 'myBlock2', e: 'myEl1' } // `b` and `e` without `!`, so we search nodes that MATCH the block `myBlock1` and
         the element `myEl1`
        { b: 'myBlock2', e: '!myEl1' } // `e` with `!`, `b` without, so we search nodes that MATCH the block `myBlock2`,
            BUT DON'T match the element 'myEl1'. In this case, nodes that match the block `myBlock2` will be SELECTED and
             only nodes that match the element `myEl1` will be IGNORED
        |
        Also with BEM-modifiers, but I hope you've understood me :)
        And finalize the trick with `-1`, to ignore blocks, modifiers and modvalues
    */
    let $all = $();
    const $self = $(this);
    // FIL Filter

    for (let fil of filters) {
        const { b, e, m, mv } = fil;
        let bem;
        // B Block
        // E Element
        // M Modifier
        // MV Modifier Value

        $all = $all.add($self.filter(function (_idx, el) {
            [...el.classList].every(function (curr) {
                let res = {};

                const
                    sepReg = sep => new RegExp('[a-zA-Z0-9]' + sep + '?[a-zA-Z0-9]'), // Separator Regex
                    check = (a, _a) => (a ? a === _a : true),
                    norm = val => val === -1 ? undefined : val; // Normalize
                const _includes = {
                    e: sepReg(bemSep.e).test(curr),
                    m: sepReg(bemSep.m).test(curr)
                };

                let _b, _e, _m, _mv;
                let
                    _temp1 = curr.split(bemSep.e),
                    _temp2 = curr.split(bemSep.m);
                if (e === -1 && _includes.e) return !(bem = false);

                _b = _temp1[0].split(bemSep.m)[0] || undefined;
                _e = (_includes.e ? _temp1[1].split(bemSep.m)[0] : undefined);
                _m = (_includes.m ? _temp2[1] : undefined);
                _mv = (_m && _temp2.length === 3 ? _temp2[2] : undefined);

                let pairs = { b: [b, _b], e: [norm(e), _e], m: [m, _m], mv: [mv, _mv] };

                for (let key in pairs) {
                    res[key] = check(...pairs[key]);
                }

                let cond = res.b && res.e && res.m && res.mv;
                return !(bem = cond);
            });
            return bem;
        }));
    }
    return $all;
}
