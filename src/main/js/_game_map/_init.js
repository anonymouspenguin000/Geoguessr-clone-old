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
