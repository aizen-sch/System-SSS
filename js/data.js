// js/data.js

export const RANKS = [
    "E", "D", "C", "B", "A", "S", "SS", "SSS", "GODS"
];

export const EXERCISES_BY_RANK = {
    "E": {
        pushups: 30,
        runMinutes: 15,
        jumps: 50,
        situps: 100,
        points: 60
    },
    "D": {
        pushups: 40,
        runMinutes: 20,
        jumps: 65,
        situps: 110,
        points: 60
    },
    "C": {
        pushups: 45,
        runMinutes: 22,
        jumps: 70,
        situps: 120,
        points: 85
    },
    "B": {
        pushups: 45,
        runMinutes: 25,
        jumps: 75,
        situps: 125,
        points: 90
    },
    "A": {
        pushups: 50,
        runMinutes: 30,
        jumps: 85,
        situps: 140,
        points: 105
    },
    "S": {
        pushups: 70,
        runMinutes: 60,
        jumps: 100,
        situps: 250,
        points: 80
    },
    "SS": {
        pushups: 100,
        runMinutes: 60,
        jumps: 200,
        situps: 300,
        points: 100
    },
    "SSS": {
        pushups: 150,
        runMinutes: 90,
        jumps: 250,
        situps: 300,
        points: 100
    },
    "GODS": {
        pushups: 250,
        runMinutes: 90,
        jumps: 500,
        situps: 500,
        points: 100
    }
};

export const RANK_UP_POINTS = {
    "E": { min: 0, max: 419, nextRank: "D" },
    "D": { min: 420, max: 1014, nextRank: "C" },
    "C": { min: 1015, max: 1749, nextRank: "B" },
    "B": { min: 1750, max: 2379, nextRank: "A" },
    "A": { min: 2380, max: 3114, nextRank: "S" },
    "S": { min: 3115, max: 3999, nextRank: "SS" },
    "SS": { min: 4000, max: 6999, nextRank: "SSS" },
    "SSS": { min: 7000, max: 19999, nextRank: "GODS" },
    "GODS": { min: 20000, max: Infinity, nextRank: null } // GODS هو المستوى الأخير
};

export const PENALTY_RATIO_POINTS = 1/5; // نسبة خصم النقاط
export const PENALTY_RATIO_EXERCISE = 1/3; // نسبة زيادة التمارين