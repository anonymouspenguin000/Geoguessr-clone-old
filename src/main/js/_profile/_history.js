if (storage.has('history', false)) {
    const
        $table = $('.history__main'),
        $rt = $('.table__row--ref').clone();
    $rt.removeAttr('hidden');

    const table = new TableManager($table, $rt);

    history.forEach(function (el, idx) {
        table.add({ id: history.length - idx, ...el });
    });
}
