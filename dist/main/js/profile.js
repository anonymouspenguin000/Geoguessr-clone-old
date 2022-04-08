'use strict';

const optNames = { // Progress options items
    pauseLog: 'pause-log'
};
Object.freeze(optNames);
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

    {
        const rt = '.stat-value';
        const $stats = $(rt);
        const setStat = (m, mv, val) => $stats.bem([{ m, mv }]).html(val);
    
        setStat('total', 'loc', stats.total.locations);
        setStat('total', 'time', readTime(stats.total.time));
        setStat('total', 'pts', stats.total.points);
    
        setStat('best', 'acc', readPrc(stats.best.accuracy));
        setStat('best', 'time', readTime(stats.best.time));
        setStat('best', 'pts', stats.best.points);
    
        setStat('avg', 'acc', readPrc(stats.average.accuracy));
        setStat('avg', 'time', readTime(stats.average.time));
        setStat('avg', 'pts', stats.average.points);
    }
    if (storage.has('history', false)) {
        const
            $table = $('.history__main'),
            $rt = $('.table__row--ref').clone();
        $rt.removeAttr('hidden');
    
        const table = new TableManager($table, $rt);
    
        history.forEach(function (el, idx) {
            table.add({ id: history.length - idx, ...el });
        });
    }
    {
        {
            const $options = $('.progress-stg__option');
            let opt = {};
        
            if (storage.has(storageItems.prgSett, false)) opt = JSON.parse(storage.get(storageItems.prgSett));
        
            applyOpt();
            $options.on('change', applyOpt);
        
            function applyOpt () {
                for (let key in optNames) {
                    let curr = $options.bem([{ m: optNames[key] }]);
                    curr.attr('checked', opt[key] || false);
                    opt[key] = curr.is(':checked');
                }
                storage.set(storageItems.prgSett, JSON.stringify(opt));
            }
        }
        {
            let impFile = '';
            let capt_str = genPass(5);
            let noProgr = !storage.has(storageItems.history, false);
        
            const
                warn = () => confirm('You will lose all your current progress. Continue?'),
                noProgrAlert = () => noProgr && alert('You don\'t have any progress');
        
            let
                $imp = $('<input type="file">'),
                $exp = $(`<a download="ggsr-clone_progress.save"></a>`);
        
            $('.progress-stg__btn--export').click(function () {
                if (noProgr) return noProgrAlert();
        
                let data = new Blob([ expProgr() ], { type: 'text/plain' });
                let url = URL.createObjectURL(data);
                $exp.attr('href', url);
                $exp[0].click();
            });
            $('.progress-stg__btn--import').click(function () {
                $imp[0].click();
            });
            $('.progress-stg__btn--delete').click(function () {
                if (noProgr) return noProgrAlert();
                if (delProgress()) location.reload();
            });
            $imp.on('change', function () {
                if (!delProgress()) return;
        
                let fr = new FileReader();
                fr.onload = function () {
                    impFile = fr.result;
                    impProgr();
                    location.reload();
                }
                fr.readAsText(this.files[0]);
            });
        
            function expProgr() {
                return btoa(
                    encodeURIComponent(
                        JSON.stringify(
                            storage.get(storageItems.history)
                        )
                    )
                );
            }
            function impProgr() {
                storage.set(storageItems.history,
                    JSON.parse(
                        decodeURIComponent(
                            atob(impFile)
                        )
                    )
                );
            }
            function delProgress() {
                if (noProgr) return true;
                if (!captcha(capt_str)) return false;
                if (!warn()) return false;
        
                storage.clearAll();
                return true;
            }
        }
    }
})