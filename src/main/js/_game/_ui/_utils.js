{
    let _eTimer = preferences.utils.timer;
    const timer = initTimer($utils.bem([{ m: 'timer' }]), _eTimer);
    if (!_eTimer) $cards.bem([{ m: 'util', mv: 'timer' }]).hide();
    window.gameCallbacks.timer = timer;

    let _eCompass = preferences.utils.compass;
    const compass = initCompass($utils.bem([{ m: 'compass' }]), _eCompass);
    if (!_eCompass) $cards.bem([{ m: 'util', mv: 'compass' }]).hide();
    window.gameCallbacks.compass = compass;

    let _vals = Object.values(preferences.utils);
    if (!_vals.includes(true)) $('.card-set--utils').css('visibility', 'hidden');
}
