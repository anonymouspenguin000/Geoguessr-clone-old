'use strict';

{
    const imgDir = 'img/';
    const guessPin = imgDir + 'guess-pin.png';
    const realPin = imgDir + 'real-pin.png';
    preload('../' + guessPin);
    preload('../' + realPin);


    let map_prep;
    let minimap;
    let panorama;

    let markers = [];
    let currData;
    const mapData = {
        realPos: {},
        guessPos: {},
    };
    let started = false;

    const povCompass = () => window.gameCallbacks.compass.rotate(panorama.getPov().heading);
    const setNormalPos = () => panorama.setPosition(mapData.realPos);
    const setZoom = (z, p) => panorama.setZoom(p ? z + getZoom() : z);
    const getZoom = () => panorama.getZoom();

    window.initMap = function () {
        currData = genPrepMap();
        //=include _game_map/_init.js
        //=include _game_map/_events.js
        //=include _game_map/_callbacks.js
    }
    $('#prep-fresh').click(refreshPrepMap);

    $(function () {
        let script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${ api.key }&callback=initMap`;
        script.async = true;
        document.head.append(script);
    });

    //=include _game_map/_functions.js
}
