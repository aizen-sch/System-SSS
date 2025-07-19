// js/data.js

// تعريف الرتب ونقاط الترقية
export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];

export const RANK_UP_POINTS = {
    'D': 100,
    'C': 300,
    'B': 600,
    'A': 1000,
    'S': 1500
};

// نسبة خصم النقاط عند عدم إكمال المهام
export const PENALTY_RATIO_POINTS = 0.15; // خصم 15% من النقاط

// تعريف التمارين لكل رتبة
export const EXERCISES_BY_RANK = {
    'E': {
        points: 10, // النقاط التي يحصل عليها عند إكمال مهام هذه الرتبة
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 10, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 10, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 20, unit: 'عدة' }
        ]
    },
    'D': {
        points: 15,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 15, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 15, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 30, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 10, unit: 'عدة' }
        ]
    },
    'C': {
        points: 20,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 20, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 20, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 40, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 15, unit: 'عدة' }
        ]
    },
    'B': {
        points: 25,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 25, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 25, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 50, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 20, unit: 'عدة' }
        ]
    },
    'A': {
        points: 30,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 30, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 30, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 60, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 25, unit: 'عدة' }
        ]
    },
    'S': {
        points: 40,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 40, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 40, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 70, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 30, unit: 'عدة' }
        ]
    }
};