{
    window.gameCallbacks.unblockGuessBtn = () => $('.game-nav--guess').removeAttr('disabled');
    let $guessCard = $('.guess-card');
    const $btns = {
        bigger: $mmTools.bem([{ m: 'bigger' }]),
        smaller: $mmTools.bem([{ m: 'smaller' }]),
        toggle: $mmTools.bem([{ m: 'toggle' }])
    };
    const
        gcWidth = w => $guessCard.width(w),
        gcHeight = h => $guessCard.height(h);

    let hidden = false;
    let nmwd, nmht;

    let gcPattern = 0;
    fitPattern();

    $btns.toggle.click(toggle);
    $btns.bigger.click(function () {
        fitPattern(1);
    });
    $btns.smaller.click(function () {
        fitPattern(2);
    });

    function toggle() {
        hidden = !hidden;

        let slf = $(this);
        let _ht = hidden ? slf.parent().height() : nmht;

        slf.css('transform', ` rotate(${ 180 * hidden }deg)`);
        gcHeight(_ht);
    }
    function fitPattern (b) {
        if (b == 1 && gcPattern < gcPatternList.length - 1) gcPattern++;
        if (b == 2 && gcPattern > 0) gcPattern--;

        let { w, h } = gcPatternList[gcPattern];
        [ nmwd, nmht ] = [ w, h ];

        if (hidden) toggle.call($btns.toggle);
        gcWidth(w);
        gcHeight(h);
    }
}
