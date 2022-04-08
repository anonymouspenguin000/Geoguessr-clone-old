{
    window.gameCallbacks.showResults = function () {
        $('.game').hide();
        $('.game-results').show();
        window.onbeforeunload = null;

        let { realPos, guessPos, time } = window.gameCallbacks.getMapData();
        [ realPos, guessPos ] = [ realPos, guessPos ].map(arrCoords);
        const distance = geoDist(realPos, guessPos);

        const sett = JSON.parse(storage.get(storageItems.prgSett) || '{}');
        if (!sett[prgSett.pauseLog]) {
            const hst_item = storageItems.history;
            if (!storage.has(hst_item)) storage.set(hst_item, '[]');
            const history = JSON.parse(storage.get(hst_item));
            history.push({
                rg: get_GET('region'),
                gp: guessPos,
                rp: realPos,
                tm: +time,
                dt: Date.now()
            });
            storage.set(hst_item, JSON.stringify(history));
        }

        const coordLen = 7;
        const cutCoords = a => a.map(el => (''+el).cut(coordLen));

        const
            $numbers = $('.game-results__number'),
            $region = $numbers.bem([{ m: 'region' }]),
            $realPos = $numbers.bem([{ m: 'position', mv: 'real' }]),
            $guessPos = $numbers.bem([{ m: 'position', mv: 'guess' }]),
            $time = $numbers.bem([{ m: 'time' }]),
            $dist = $numbers.bem([{ m: 'distance' }]),
            $gAcc = $numbers.bem([{ m: 'accuracy' }]),
            $pts = $numbers.bem([{ m: 'points' }]);

        $region.html(window.gameCallbacks.getRegion().capitalize());
        
        $realPos.html(cutCoords(realPos));
        $realPos.attr('href', coordsLink(realPos));
        $guessPos.html(cutCoords(guessPos));
        $guessPos.attr('href', coordsLink(guessPos));

        $time.html(time.toString());
        $dist.html(readDist(distance));

        let _acc = calcAcc(distance);
        $gAcc.html(readPrc(_acc));
        $pts.html(calcPts(_acc, +time));
    }
}