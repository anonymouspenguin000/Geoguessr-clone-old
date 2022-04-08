const gcPatternList = [
    { w: '15vw', h: '25vh' },
    { w: '20vw', h: '40vh' },
    { w: '30vw', h: '50vh' },
    { w: '45vw', h: '60vh' },
    { w: '60vw', h: '70vh' }
];
const geoBounds = {
    'north america': [
        { lat: [59, 37], lng: [-125, -87] },
        { lat: [35, 30], lng: [-102, -82] }
    ],
    'south america': [
        { lat: [22, 18], lng: [-102, -95] },
        { lat: [11, -20], lng: [-55, -40] },
        { lat: [-22, -34], lng: [-74, -53] },
        { lat: [-35, -55], lng: [-73, -65] }
    ],
    'europe': [
        { lat: [56, 37], lng: [-9, 10] },
        { lat: [69, 38], lng: [6, 25] },
        { lat: [55, 51], lng: [37, 39] }
    ],
    'africa': [
        { lat: [33, 30], lng: [34, 36] },
        { lat: [25, 24], lng: [55, 56] },
        { lat: [-22, -29], lng: [24, 31] }
    ],
    'asia': [
        { lat: [40, 35], lng: [28, 43] },
        { lat: [9, 5], lng: [79, 82] },
        { lat: [44, 35], lng: [139, 141] },
        { lat: [35, 31], lng: [129, 139] },
        { lat: [20, 9], lng: [98, 107] },
        { lat: [9, 0], lng: [98, 104] },
        { lat: [25, 22], lng: [120, 121] },
        { lat: [-5, -8], lng: [106, 114] },
        { lat: [18, 6], lng: [119, 126] }
    ],
    'australia': [
        { lat: [-25, -34], lng: [113, 120] },
        { lat: [-28, -37], lng: [142, 152] },
        { lat: [-40, -47], lng: [144, 148] },
        { lat: [-37, -42], lng: [172, 177] }
    ]
};
const api = {
    key: 'AIzaSyCGnJT9tvnMXJcH462WZeIlo2FG2jn9PL4'
};
Object.freeze(gcPatternList);
Object.freeze(geoBounds);
Object.freeze(api);
