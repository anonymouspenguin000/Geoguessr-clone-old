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
