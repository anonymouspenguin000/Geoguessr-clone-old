'use strict';


$(function () {
    {
        const $sett = $('#sett');
        const show = m => $(`.fieldset-block--${ m }`).removeClass('enter-form__item--hidden');
    
        $sett.on('contextmenu', function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        });
    
        $sett.click(function () {
            show('preferences');
            $(this).parent().remove();
        });
    
        let _md = false;
        $sett.on('pointerdown', function () {
            _md = true;
            setTimeout(function () {
                if(_md) show('experiments');
            }, 2000);
        });
        $(window).on('pointerup', function () {
            _md = false;
        });
    }
});