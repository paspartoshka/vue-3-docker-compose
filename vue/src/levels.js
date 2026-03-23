export const LEVELS = [
    {
        id: 1, number: '1 уровень', width: 800, height: 500, gold: 200,
        path: [
            { x: 0,   y: 120 }, { x: 180, y: 120 }, { x: 180, y: 320 },
            { x: 420, y: 320 }, { x: 420, y: 80  }, { x: 650, y: 80  },
            { x: 650, y: 380 }, { x: 800, y: 380 }
        ],
        slots: [
            { id: '1', x: 80,  y: 200 }, { id: '2', x: 290, y: 240 },
            { id: '3', x: 290, y: 400 }, { id: '4', x: 500, y: 180 },
            { id: '5', x: 570, y: 300 }, { id: '6', x: 720, y: 200 }
        ],
        spawns: [
            { name: 'Гоблин', hp: 60,  speed: 5, reward: 100, color: '#49fb89' },
            { name: 'Орк', hp: 100, speed: 3, reward: 150, color: '#036013' }
        ],
        waves: [
            [{ spawnIndex: 0, count: 5, interval: 1200 }],
            [{ spawnIndex: 0, count: 6, interval: 1000 }, { spawnIndex: 1, count: 2, interval: 2000 }],
        ],
    },
    {
        id: 2, number: '2 уровень', width: 800, height: 500, gold: 200,
        path: [
            { x: 0,   y: 250 }, { x: 200, y: 250 }, { x: 200, y: 80  },
            { x: 400, y: 80  }, { x: 400, y: 420 }, { x: 600, y: 420 },
            { x: 600, y: 160 }, { x: 800, y: 160 }
        ],
        slots: [
            { id: '1', x: 90,  y: 170 }, { id: '2', x: 90,  y: 320 },
            { id: '3', x: 300, y: 160 }, { id: '4', x: 500, y: 360 },
            { id: '5', x: 660, y: 300 }, { id: '6', x: 700, y: 100  }
        ],
        spawns: [
            { name: 'Гоблин', hp: 60,  speed: 5, reward: 100, color: '#49fb89' },
            { name: 'Орк', hp: 100, speed: 3, reward: 150, color: '#036013' },
            { name: 'Паук', hp: 40,  speed: 7, reward: 50, color: '#353535' }
        ],
        waves: [
            [{ spawnIndex: 0, count: 4, interval: 1200 }, { spawnIndex: 2, count: 2, interval: 1200 }],
            [{ spawnIndex: 0, count: 6, interval: 1000 }, { spawnIndex: 1, count: 2, interval: 2000 }],
        ],
    }
]