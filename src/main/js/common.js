'use strict';

//=include _common/_config.js
//=include _common/_functions.js
//=include _common/_classes.js

const url_obj = new URL(location.href);
const storage = new StorageManager(localStorage);
const session = new StorageManager(sessionStorage);

$(function () {
    _easter000();
    $('.warning__button--small-device').click(function () {
        $('.warning--small-device').hide();
    });

    let _c = 0;
    $('.header__logo .txt-min').click(function () {
        _c++;
        if (_c == 20) session.set('easter_000', 'true');
        _easter000();
    });
    function _easter000() {
        if (session.get('easter_000') !== 'true') return;
        $('body *').css('cursor', 'url("img/test-min.png"), default');
    }
});
