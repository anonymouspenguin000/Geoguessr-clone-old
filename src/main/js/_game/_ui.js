{
    if (preferences.experiments.noImages) $('img').attr('src', '');
    let
        $cards = $('.card'),
        $utils = $('.util'),
        $round = $('.stat'),
        $nav = $('.game-nav'),
        $mmTools = $('.mm-tool');

    //=include _ui/_utils.js
    //=include _ui/_minimap-tools.js

    $round.bem([{ m: 'region' }]).html(region.capitalize());

    $nav.bem([{ m: 'quit' }]).click(function () {
        quit();
    });
    $nav.bem([{ m: 'go-to-start' }]).click(() => window.gameCallbacks.goToStart());
    $nav.bem([{ m: 'zoom-in' }]).click(() => window.gameCallbacks.zoomIn());
    $nav.bem([{ m: 'zoom-out' }]).click(() => window.gameCallbacks.zoomOut());

    $nav.bem([{ m: 'guess' }]).click(() => window.gameCallbacks.guess());
}
