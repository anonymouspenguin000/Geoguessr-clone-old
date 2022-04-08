{
    let impFile = '';
    let capt_str = genPass(5);
    let noProgr = !storage.has(storageItems.history, false);

    const
        warn = () => confirm('You will lose all your current progress. Continue?'),
        noProgrAlert = () => noProgr && alert('You don\'t have any progress');

    let
        $imp = $('<input type="file">'),
        $exp = $(`<a download="ggsr-clone_progress.save"></a>`);

    $('.progress-stg__btn--export').click(function () {
        if (noProgr) return noProgrAlert();

        let data = new Blob([ expProgr() ], { type: 'text/plain' });
        let url = URL.createObjectURL(data);
        $exp.attr('href', url);
        $exp[0].click();
    });
    $('.progress-stg__btn--import').click(function () {
        $imp[0].click();
    });
    $('.progress-stg__btn--delete').click(function () {
        if (noProgr) return noProgrAlert();
        if (delProgress()) location.reload();
    });
    $imp.on('change', function () {
        if (!delProgress()) return;

        let fr = new FileReader();
        fr.onload = function () {
            impFile = fr.result;
            impProgr();
            location.reload();
        }
        fr.readAsText(this.files[0]);
    });

    function expProgr() {
        return btoa(
            encodeURIComponent(
                JSON.stringify(
                    storage.get(storageItems.history)
                )
            )
        );
    }
    function impProgr() {
        storage.set(storageItems.history,
            JSON.parse(
                decodeURIComponent(
                    atob(impFile)
                )
            )
        );
    }
    function delProgress() {
        if (noProgr) return true;
        if (!captcha(capt_str)) return false;
        if (!warn()) return false;

        storage.clearAll();
        return true;
    }
}
