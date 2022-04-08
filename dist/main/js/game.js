'use strict';

window.gameCallbacks = {};

const gcPatternList = [
    { w: '15vw', h: '25vh' },
    { w: '20vw', h: '40vh' },
    { w: '30vw', h: '50vh' },
    { w: '45vw', h: '60vh' },
    { w: '60vw', h: '70vh' }
];
const geoBounds = {
    'north america': [
        { lat: [59, 37], lng: [-125, -87] },
        { lat: [35, 30], lng: [-102, -82] }
    ],
    'south america': [
        { lat: [22, 18], lng: [-102, -95] },
        { lat: [11, -20], lng: [-55, -40] },
        { lat: [-22, -34], lng: [-74, -53] },
        { lat: [-35, -55], lng: [-73, -65] }
    ],
    'europe': [
        { lat: [56, 37], lng: [-9, 10] },
        { lat: [69, 38], lng: [6, 25] },
        { lat: [55, 51], lng: [37, 39] }
    ],
    'africa': [
        { lat: [33, 30], lng: [34, 36] },
        { lat: [25, 24], lng: [55, 56] },
        { lat: [-22, -29], lng: [24, 31] }
    ],
    'asia': [
        { lat: [40, 35], lng: [28, 43] },
        { lat: [9, 5], lng: [79, 82] },
        { lat: [44, 35], lng: [139, 141] },
        { lat: [35, 31], lng: [129, 139] },
        { lat: [20, 9], lng: [98, 107] },
        { lat: [9, 0], lng: [98, 104] },
        { lat: [25, 22], lng: [120, 121] },
        { lat: [-5, -8], lng: [106, 114] },
        { lat: [18, 6], lng: [119, 126] }
    ],
    'australia': [
        { lat: [-25, -34], lng: [113, 120] },
        { lat: [-28, -37], lng: [142, 152] },
        { lat: [-40, -47], lng: [144, 148] },
        { lat: [-37, -42], lng: [172, 177] }
    ]
};
const api = {
    key: 'AIzaSyCGnJT9tvnMXJcH462WZeIlo2FG2jn9PL4'
};
Object.freeze(gcPatternList);
Object.freeze(geoBounds);
Object.freeze(api);
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
$(function () {
    let
        pageWidth = $('html').width(),
        pageHeight = $('html').height();

    const region = get_GET('region') || 'world';
    const preferences = {
        experiments: {
            allowSmallScreen: get_GET('alwsmlscrn') == 'on',
            noImages: get_GET('noimg') == 'on'
        },
        utils: {
            compass: get_GET('compass') == 'on',
            timer: get_GET('timer') == 'on'
        }
    };
    Object.freeze(preferences);
    window.gameCallbacks.getRegion = () => region;

    if (pageWidth < 1000 || pageHeight < 500) {
        if (!preferences.experiments.allowSmallScreen) {
            alert('I don\'t recommend playing on devices with a small screen. If you want, you can allow it in experiments - hold the "Preferences" button for 3 seconds. Anyway, I recommend playing on a PC or a laptop');
            goHomepage();
        }
    }
    window.onbeforeunload = () => true; // FIXME: Sometimes it fails

    {
        if (preferences.experiments.noImages) $('img').attr('src', '');
        let
            $cards = $('.card'),
            $utils = $('.util'),
            $round = $('.stat'),
            $nav = $('.game-nav'),
            $mmTools = $('.mm-tool');
    
        {
            let _eTimer = preferences.utils.timer;
            const timer = initTimer($utils.bem([{ m: 'timer' }]), _eTimer);
            if (!_eTimer) $cards.bem([{ m: 'util', mv: 'timer' }]).hide();
            window.gameCallbacks.timer = timer;
        
            let _eCompass = preferences.utils.compass;
            const compass = initCompass($utils.bem([{ m: 'compass' }]), _eCompass);
            if (!_eCompass) $cards.bem([{ m: 'util', mv: 'compass' }]).hide();
            window.gameCallbacks.compass = compass;
        
            let _vals = Object.values(preferences.utils);
            if (!_vals.includes(true)) $('.card-set--utils').css('visibility', 'hidden');
        }
        {
            window.gameCallbacks.unblockGuessBtn = () => $('.game-nav--guess').removeAttr('disabled');
            let $guessCard = $('.guess-card');
            const $btns = {
                bigger: $mmTools.bem([{ m: 'bigger' }]),
                smaller: $mmTools.bem([{ m: 'smaller' }]),
                toggle: $mmTools.bem([{ m: 'toggle' }])
            };
            const
                gcWidth = w => $guessCard.width(w),
                gcHeight = h => $guessCard.height(h);
        
            let hidden = false;
            let nmwd, nmht;
        
            let gcPattern = 0;
            fitPattern();
        
            $btns.toggle.click(toggle);
            $btns.bigger.click(function () {
                fitPattern(1);
            });
            $btns.smaller.click(function () {
                fitPattern(2);
            });
        
            function toggle() {
                hidden = !hidden;
        
                let slf = $(this);
                let _ht = hidden ? slf.parent().height() : nmht;
        
                slf.css('transform', ` rotate(${ 180 * hidden }deg)`);
                gcHeight(_ht);
            }
            function fitPattern (b) {
                if (b == 1 && gcPattern < gcPatternList.length - 1) gcPattern++;
                if (b == 2 && gcPattern > 0) gcPattern--;
        
                let { w, h } = gcPatternList[gcPattern];
                [ nmwd, nmht ] = [ w, h ];
        
                if (hidden) toggle.call($btns.toggle);
                gcWidth(w);
                gcHeight(h);
            }
        }
    
        $round.bem([{ m: 'region' }]).html(region.capitalize());
    
        $nav.bem([{ m: 'quit' }]).click(function () {
            quit();
        });
        $nav.bem([{ m: 'go-to-start' }]).click(() => window.gameCallbacks.goToStart());
        $nav.bem([{ m: 'zoom-in' }]).click(() => window.gameCallbacks.zoomIn());
        $nav.bem([{ m: 'zoom-out' }]).click(() => window.gameCallbacks.zoomOut());
    
        $nav.bem([{ m: 'guess' }]).click(() => window.gameCallbacks.guess());
    }
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
});