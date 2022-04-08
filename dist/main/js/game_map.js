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
        {
            map_prep = new google.maps.Map($('#prepare')[0], {
                ...currData,
                disableDefaultUI: true,
                streetViewControl: true,
                gestureHandling: "none",
                zoomControl: false
            });
            minimap = new google.maps.Map($('#minimap')[0], {
                center: {lat: 0, lng: 0},
                zoom: 2,
                minZoom: 2,
                streetViewControl: false,
                fullscreenControl: false
            });
            panorama = new google.maps.StreetViewPanorama($('#panorama')[0], {
                showRoadLabels: false,
                disableDefaultUI: true,
                linksControl: true,
                pov: {
                    heading: (Math.random() * 360),
                    pitch: 0
                }
            });
            map_prep.setStreetView(panorama);
        }
        {
            minimap.addListener('click', function (evt) {
                let curr = evt.latLng;
                placePin(curr, true, imgDir + 'guess-pin.png');
            });
            panorama.addListener('position_changed', function() {
                if (!started) {
                    started = true;
                    setTimeout(function () {
                        $('.window--rand').hide();
                        $('.window--catch').show();
                        setTimeout(function () {
                            setNormalPos();
                            setZoom(0);
                            $('.prepare').hide();
                            window.gameCallbacks.timer.start();
                        }, 15000);
                    }, 100)
                    let pos = panorama.getPosition();
                    mapData.realPos = pos;
                    if (get_GET('cheat') == 'on') alert([pos.lat(), pos.lng()]);
                }
                povCompass();
            });
            panorama.addListener('pov_changed', povCompass);
        }
        {
            window.gameCallbacks.getMapData = () => mapData;
            window.gameCallbacks.goToStart = setNormalPos;
            window.gameCallbacks.zoomIn = () => setZoom(0.5, true);
            window.gameCallbacks.zoomOut = () => setZoom(-0.5, true);
            window.gameCallbacks.guess = function () {
                if (!confirm('Are you sure?')) return;
                window.gameCallbacks.timer.stop();
                mapData.time = window.gameCallbacks.timer.getTime();
        
                google.maps.event.clearListeners(panorama, 'position_changed');
                google.maps.event.clearListeners(minimap, 'click');
        
                minimap.setOptions({
                    center: { lat: 0, lng: 0 },
                    minZoom: 1,
                    zoom: 1,
                    disableDefaultUI: true
                });
                placePin(mapData.realPos, false, imgDir + 'real-pin.png', coordsLink(arrCoords(mapData.realPos)));
                showResultsMap();
                setTimeout(zoomToMarkers, 1500);
                window.gameCallbacks.showResults();
            }
        }
    }
    $('#prep-fresh').click(refreshPrepMap);

    $(function () {
        let script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${ api.key }&callback=initMap`;
        script.async = true;
        document.head.append(script);
    });

    function showResultsMap() {
        $('#minimap').appendTo('#results-map');
    }
    function zoomToMarkers() {
        let bounds = new google.maps.LatLngBounds();
    
        for (let m of markers) {
            bounds.extend(m.position);
        }
    
        minimap.fitBounds(bounds);
    }
    function placePin(pos, guessPin, icon, url) {
        if (guessPin) {
            removeAllPins();
            mapData.guessPos = pos;
            window.gameCallbacks.unblockGuessBtn();
        }
    
        let marker = new google.maps.Marker({
            position: pos,
            map: minimap,
            icon
        });
    
        if (url) {
            marker.addListener('click', function () {
                let a = $('<a></a>');
                a.attr('href', url);
                a.attr('target', '_blank');
                a[0].click();
            });
        }
    
        markers.push(marker);
    }
    function removeAllPins() {
        for (let marker of markers) {
            marker.setMap(null);
        }
    
        markers = [];
    }
    function refreshPrepMap() {
        currData = genPrepMap();
        map_prep.setOptions({ ...currData });
    }
    function genPrepMap() {
        return {
            center: rndReg(window.gameCallbacks.getRegion()),
            zoom: ~~(rnd(6, 12))
        };
    }
}