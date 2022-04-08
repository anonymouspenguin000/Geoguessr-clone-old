const bemSep = { // Bem Separators
    e: '__',
    m: '--'
};
const storageItems = {
    prgSett: 'prg-settings',
    history: 'history'
};
const prgSett = {
    pauseLog: 'pauseLog'
};
const natural = { // Natural data in System International
    ER: 6371e3, // Earth radius
    EC: 40075e3 // Earth circumference
};
const gameValue = {
    ptsSecDiv: 120,  // Point seconds divider
    maxPts: 25e3
};
Object.freeze(bemSep);
Object.freeze(storageItems);
Object.freeze(prgSett);
Object.freeze(natural);
Object.freeze(gameValue);
