{
    const $options = $('.progress-stg__option');
    let opt = {};

    if (storage.has(storageItems.prgSett, false)) opt = JSON.parse(storage.get(storageItems.prgSett));

    applyOpt();
    $options.on('change', applyOpt);

    function applyOpt () {
        for (let key in optNames) {
            let curr = $options.bem([{ m: optNames[key] }]);
            curr.attr('checked', opt[key] || false);
            opt[key] = curr.is(':checked');
        }
        storage.set(storageItems.prgSett, JSON.stringify(opt));
    }
}
