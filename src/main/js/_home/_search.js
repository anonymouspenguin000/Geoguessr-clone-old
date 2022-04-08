{
    // Just a draft
    // Just a draft
    // Just a draft

    Array.prototype.deepSearch = function (sub) {
        sub = sub.toLowerCase();
        let res = [];
        for (let el of this) {
            if (el.toLowerCase().includes(sub)) res.push(el);
        }
        return res;
    }
    let variants = ['World', 'USA', 'Canada', 'Mexico', 'Japan', 'China', 'India', 'Russia', 'Ukraine'];
    let
        $search = $('#search'),
        $save = $('#search-save'),
        $dataset = $('#regions');

    const fillDefault = () => putRegions(requestRegions(''));
    fillDefault();

    let _kd = false;
    $(window).keydown(() => _kd = true);
    $(window).keyup(() => _kd = false);
    $search.on('input', function () {
        if (!_kd) return;
        let val = $(this).val();
        putRegions(requestRegions(val));
    });
    $search.on('blur', function () {
        let slf = $(this);
        let val = slf.val();
        if (requestRegions(val).length > 0) $save.val(val);
        else $save.val('');
    });
    function putRegions(a) {
        let toAdd = $();
        a.forEach(el => {
            toAdd = toAdd.add(`<option value="${ el }"></option>`);
        });
        $dataset.html(toAdd);
    }
    function requestRegions(s) {
        s = s.trim().toLowerCase();
        const defVars = ['World', 'America', 'Europe', 'Asia', 'Africa', 'Australia'];
        let res;
        if (s == '') res = Object.assign([], defVars);
        else res = variants.deepSearch(s);
        return res;
    }
}