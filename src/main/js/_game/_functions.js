function initTimer($timer, dom = true) {
    let seconds = 0;
    let time = '00:00:00';
    let timer;

    return {
        start() {
            timer = setInterval(function () {
                seconds++;
                time = readTime(seconds);
                dom && $timer.html(time);
            }, 1000);
        },
        stop: () => clearInterval(timer),
        getTime: () => ({
            toString: () => time,
            valueOf: () => seconds
        })
    };
}
function initCompass($compass, dom = true) {
    return {
        rotate: deg => dom && $compass.css('transform', `rotate(${ deg }deg)`)
    };
}
function quit() {
    if (confirm('You will lose the whole progress of this round. Quit the game?')) goHomepage();
}
function rnd(f, t) {
    return Math.random() * (t - f) + f;
}
function rndReg(reg = '*') {
    if (reg == '') return null;
    const lenGen = l => ~~(rnd(0, l));

    let _key = reg;
    let _boundList = geoBounds[_key];
    let _names = Object.keys(geoBounds);
    if (reg == '*' || reg == 'world') {
        _key = lenGen(_names.length);
        _boundList = geoBounds[_names[_key]];
    }
    let _idx = lenGen(_boundList.length);

    let bounds = _boundList[_idx];
    let [ temp1a, temp1b ] = bounds.lat;
    let [ temp2a, temp2b ] = bounds.lng;
    let res = {
        lat: rnd(temp1a, temp1b),
        lng: rnd(temp2a, temp2b)
    };
    return res;
}
