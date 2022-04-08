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
