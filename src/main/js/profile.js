'use strict';

//=include _profile/_config.js
$(function () {
    let _hst = JSON.parse(storage.get(storageItems.history) || '[]');
    const history = [];
    const stats = {
        total: {
            locations: 0,
            time: 0,
            points: 0,
            _acc: 0
        },
        best: {
            accuracy: 0,
            time: Infinity,
            points: 0
        },
        average: {
            accuracy: 0,
            time: 0,
            points: 0
        }
    };
    _hst.forEach(function (obj) {
        let best = stats.best;
        let total = stats.total;

        const coordAnchor = cd => `<a target="_blank" href="${ coordsLink(cd) }">${ cd.map(el => (''+el).cut(4)) }</a>`;
        let { rg = 'world', gp, rp, tm, dt } = obj;
        let ds = geoDist(gp, rp);
        let ac = calcAcc(ds);
        let pt = calcPts(ac, tm);

        total.locations++;
        total.time += tm;
        total.points += pt;
        total._acc += ac;

        if (ac > best.accuracy) best.accuracy = ac;
        if (pt > best.points) best.points = pt;
        if (tm < best.time) best.time = tm;

        history.push({
            rg: rg.capitalize(),
            gp: coordAnchor(gp),
            rp: coordAnchor(rp),
            ds: readDist(ds),
            ac: readPrc(ac),
            tm: readTime(tm),
            dt: readDate(dt),
            pt
        });
    });
    history.reverse();

    let hist_len = stats.total.locations;
    if (hist_len > 0) {
        stats.average.accuracy = stats.total._acc / hist_len;
        stats.average.time = Math.floor(stats.total.time / hist_len);
        stats.average.points = Math.floor(stats.total.points / hist_len);
    }

    //=include _profile/_stats.js
    //=include _profile/_history.js
    //=include _profile/_settings.js
})
