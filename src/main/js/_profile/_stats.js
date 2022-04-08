{
    const rt = '.stat-value';
    const $stats = $(rt);
    const setStat = (m, mv, val) => $stats.bem([{ m, mv }]).html(val);

    setStat('total', 'loc', stats.total.locations);
    setStat('total', 'time', readTime(stats.total.time));
    setStat('total', 'pts', stats.total.points);

    setStat('best', 'acc', readPrc(stats.best.accuracy));
    setStat('best', 'time', readTime(stats.best.time));
    setStat('best', 'pts', stats.best.points);

    setStat('avg', 'acc', readPrc(stats.average.accuracy));
    setStat('avg', 'time', readTime(stats.average.time));
    setStat('avg', 'pts', stats.average.points);
}
