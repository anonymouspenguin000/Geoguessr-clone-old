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
