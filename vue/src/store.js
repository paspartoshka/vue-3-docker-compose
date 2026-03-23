import { createStore } from 'vuex'
import { LEVELS } from './levels'
import { TOWERS } from './towers.js'

let enemyId = 1

const SET_LEVEL = 'SET_LEVEL'
const SET_GOLD = 'SET_GOLD'
const SET_SELECTED_SLOT = 'SET_SELECTED_SLOT'
const ADD_TOWER = 'ADD_TOWER'
const REMOVE_TOWER = 'REMOVE_TOWER'
const UPGRADE_TOWER = 'UPGRADE_TOWER'
const SET_TOWER_LAST_SHOT = 'SET_TOWER_LAST_SHOT'
const ADD_ENEMY = 'ADD_ENEMY'
const REMOVE_ENEMY = 'REMOVE_ENEMY'
const MOVE_ENEMY = 'MOVE_ENEMY'
const DAMAGE_ENEMY = 'DAMAGE_ENEMY'
const SET_SELECTED_ENEMY = 'SET_SELECTED_ENEMY'
const SET_GAME_OVER = 'SET_GAME_OVER'
const SET_WAVE = 'SET_WAVE'
const SET_SPAWN_QUEUE = 'SET_SPAWN_QUEUE'

export default createStore({
    state: {
        level: LEVELS[0],
        gold: LEVELS[0].gold,
        lives: LEVELS[0].lives,
        towers: {},
        selectedSlot: null,
        enemies: {},
        selectedEnemy: null,
        gameOver: false,
        waveIndex: -1,
        spawnQueue: [],
    },

    getters: {
        pathPoints(state) {
            return state.level.path.map((p) => `${p.x},${p.y}`).join(' ')
        },
        enemyList(state) {
            return Object.values(state.enemies)
        },
        selectedTower(state) {
            return state.towers[state.selectedSlot] || null
        },
        selectedEnemyId(state) {
            return state.selectedEnemy
        },
        gameOver(state) {
            return state.gameOver
        },
        waveIndex(state) {
            return state.waveIndex
        },
        hasNextWave(state) {
            return state.waveIndex < state.level.waves.length - 1
        },
        waveInProgress(state) {
            return state.spawnQueue.some((g) => g.remaining > 0)
        },
    },

    mutations: {
        [SET_LEVEL](state, level) {
            state.level = level
            state.gold = level.gold
            state.lives = level.lives
            state.towers = {}
            state.enemies = {}
            state.selectedSlot = null
            state.selectedEnemy = null
            state.gameOver = false
            state.waveIndex = -1
            state.spawnQueue = []
            enemyId = 1
        },

        [SET_GOLD](state, v) { state.gold = v },

        [SET_SELECTED_SLOT](state, slotId) { state.selectedSlot = slotId },

        [ADD_TOWER](state, { slotId, tower }) {
            state.towers = { ...state.towers, [slotId]: tower }
        },

        [REMOVE_TOWER](state, slotId) {
            const next = { ...state.towers }
            delete next[slotId]
            state.towers = next
            state.selectedSlot = null
        },

        [UPGRADE_TOWER](state, slotId) {
            const tower = state.towers[slotId]
            const cfg = TOWERS[tower.type]
            const nextLvl = tower.level + 1
            state.towers = {
                ...state.towers,
                [slotId]: { ...tower, level: nextLvl, ...cfg.levels[nextLvl - 1] },
            }
        },

        [SET_TOWER_LAST_SHOT](state, { slotId, now }) {
            const tower = state.towers[slotId]
            if (!tower) return
            state.towers = { ...state.towers, [slotId]: { ...tower, lastShot: now } }
        },

        [ADD_ENEMY](state, enemy) {
            state.enemies = { ...state.enemies, [enemy.id]: enemy }
        },

        [REMOVE_ENEMY](state, id) {
            const next = { ...state.enemies }
            delete next[id]
            state.enemies = next
            if (state.selectedEnemy === id) state.selectedEnemy = null
        },

        [MOVE_ENEMY](state, { id, x, y, pathIndex }) {
            if (!state.enemies[id]) return
            state.enemies = {
                ...state.enemies,
                [id]: { ...state.enemies[id], x, y, pathIndex },
            }
        },

        [DAMAGE_ENEMY](state, { id, amount }) {
            if (!state.enemies[id]) return
            const enemy = state.enemies[id]
            const hp = Math.max(0, enemy.hp - amount)
            if (hp <= 0) {
                const next = { ...state.enemies }
                delete next[id]
                state.enemies = next
                if (state.selectedEnemy === id) state.selectedEnemy = null
                state.gold += enemy.reward
            } else {
                state.enemies = { ...state.enemies, [id]: { ...enemy, hp } }
            }
        },

        [SET_SELECTED_ENEMY](state, id) {
            state.selectedEnemy = state.selectedEnemy === id ? null : id
        },

        [SET_GAME_OVER](state) {
            state.gameOver = true
        },

        [SET_WAVE](state, { waveIndex, spawnQueue }) {
            state.waveIndex = waveIndex
            state.spawnQueue = spawnQueue
        },

        [SET_SPAWN_QUEUE](state, queue) {
            state.spawnQueue = queue
        },
    },

    actions: {
        selectLevel({ commit }, level) {
            commit('SET_LEVEL', level)
        },

        selectSlot({ commit, state }, slotId) {
            commit('SET_SELECTED_SLOT', state.selectedSlot === slotId ? null : slotId)
        },

        placeTower({ commit, state }, type) {
            const slotId = state.selectedSlot
            if (!slotId) return
            const cfg = TOWERS[type]
            if (state.gold < cfg.cost) return
            commit('SET_GOLD', state.gold - cfg.cost)
            commit('ADD_TOWER', { slotId, tower: { type, level: 1, lastShot: 0, ...cfg.levels[0] } })
        },

        removeTower({ commit, state }, slotId) {
            const tower = state.towers[slotId]
            if (!tower) return
            commit('SET_GOLD', state.gold + TOWERS[tower.type].refund)
            commit('REMOVE_TOWER', slotId)
        },

        upgradeTower({ commit, state }, slotId) {
            const tower = state.towers[slotId]
            if (!tower) return
            const cfg = TOWERS[tower.type]
            if (tower.level >= cfg.levels.length) return
            const cost = cfg.upgradeCost[tower.level - 1]
            if (state.gold < cost) return
            commit('SET_GOLD', state.gold - cost)
            commit('UPGRADE_TOWER', slotId)
        },

        spawnEnemy({ commit, state }, spawn) {
            const start = state.level.path[0]
            const id = `e${enemyId++}`
            commit('ADD_ENEMY', {
                id, x: start.x, y: start.y,
                hp: spawn.hp, maxHp: spawn.hp,
                speed: spawn.speed, reward: spawn.reward,
                color: spawn.color, pathIndex: 0,
            })
        },

        moveEnemy({ commit }, payload) { commit('MOVE_ENEMY', payload) },

        removeEnemy({ commit }, id) { commit('REMOVE_ENEMY', id) },

        selectEnemy({ commit }, id) { commit('SET_SELECTED_ENEMY', id) },

        startWave({ commit, state }) {
            const nextIndex = state.waveIndex + 1
            if (nextIndex >= state.level.waves.length) return
            const wave = state.level.waves[nextIndex]
            const spawnQueue = wave.map((group) => ({
                spawnIndex: group.spawnIndex,
                interval: group.interval,
                remaining: group.count,
                lastSpawn: 0,
            }))
            commit('SET_WAVE', { waveIndex: nextIndex, spawnQueue })
        },

        tick({ commit, dispatch, state }) {
            if (state.gameOver) return

            const now = Date.now()
            const path = state.level.path

            state.spawnQueue.forEach((group, groupIndex) => {
                if (group.remaining <= 0) return
                if (now - group.lastSpawn < group.interval) return
                const spawn = state.level.spawns[group.spawnIndex]
                dispatch('spawnEnemy', spawn)
                const queue = state.spawnQueue.map((g, i) =>
                    i === groupIndex ? { ...g, remaining: g.remaining - 1, lastSpawn: now } : g
                )
                commit('SET_SPAWN_QUEUE', queue)
            })

            Object.values(state.enemies).forEach((enemy) => {
                let { x, y, pathIndex, speed } = enemy
                let dist = speed
                while (dist > 0) {
                    const nextIndex = pathIndex + 1
                    if (nextIndex >= path.length) {
                        commit('SET_GAME_OVER')
                        return
                    }
                    const to = path[nextIndex]
                    const dx = to.x - x
                    const dy = to.y - y
                    const len = Math.sqrt(dx * dx + dy * dy)
                    if (dist >= len) {
                        x = to.x
                        y = to.y
                        pathIndex = nextIndex
                        dist -= len
                    } else {
                        x = x + dx * (dist / len)
                        y = y + dy * (dist / len)
                        dist = 0
                    }
                }
                commit('MOVE_ENEMY', { id: enemy.id, x, y, pathIndex })
            })

            const enemies = Object.values(state.enemies)
            if (enemies.length === 0) return
            const slotMap = {}
            state.level.slots.forEach((s) => { slotMap[s.id] = s })
            Object.entries(state.towers).forEach(([slotId, tower]) => {
                const slot = slotMap[slotId]
                if (!slot || now - tower.lastShot < tower.fireRate) return
                const target = enemies.find((e) => {
                    const dx = slot.x - e.x
                    const dy = slot.y - e.y
                    return Math.sqrt(dx * dx + dy * dy) <= tower.range
                })
                if (!target) return
                commit('SET_TOWER_LAST_SHOT', { slotId, now })
                commit('DAMAGE_ENEMY', { id: target.id, amount: tower.damage })
            })
        },
    },
})