'use strict';

window.gameCallbacks = {};

//=include _game/_config.js
//=include _game/_functions.js
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

    //=include _game/_ui.js
    //=include _game/_results.js
});
