// js/data.js

// تعريف الرتب من الأدنى إلى الأعلى
export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'GODS'];

// تعريف نقاط الترقية لكل رتبة (الحد الأدنى للنقاط للوصول للرتبة التالية)
export const RANK_UP_POINTS = {
    'D': 420,
    'C': 1015,
    'B': 1750,
    'A': 2380,
    'S': 3115,
    'SS': 4000,
    'SSS': 7000,
    'GODS': 20000
};

// نسبة خصم النقاط عند عدم إكمال المهام
export const PENALTY_RATIO_POINTS = 0.20; // 1/5 من النقاط = 20%

// نسبة زيادة صعوبة التمرين عند العقوبة
// مثال: 1/3 من القيمة الأساسية، أي 33% زيادة
export const PENALTY_EXERCISE_INCREASE_RATIO = 0.33; 

// تعريف التمارين لكل رتبة والقاط اليومية المكتسبة
export const EXERCISES_BY_RANK = {
    'E': {
        points: 60, // النقاط التي يحصل عليها عند إكمال مهام هذه الرتبة
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 30, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 15, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 50, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 100, unit: 'عدة' }
        ]
    },
    'D': {
        points: 60,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 40, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 20, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 65, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 110, unit: 'عدة' }
        ]
    },
    'C': {
        points: 85,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 45, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 22, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 70, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 120, unit: 'عدة' }
        ]
    },
    'B': {
        points: 90,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 45, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 25, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 75, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 125, unit: 'عدة' }
        ]
    },
    'A': {
        points: 105,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 50, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 30, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 85, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 140, unit: 'عدة' }
        ]
    },
    'S': {
        points: 80, // لاحظ أن النقاط هنا أقل من A
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 70, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 60, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 100, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 250, unit: 'عدة' }
        ]
    },
    'SS': {
        points: 100,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 100, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 60, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 200, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 300, unit: 'عدة' }
        ]
    },
    'SSS': {
        points: 100,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 150, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 90, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 250, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 300, unit: 'عدة' }
        ]
    },
    'GODS': {
        points: 100,
        exercises: [
            { key: 'pushups', name: 'تمرين الضغط', baseValue: 250, unit: 'عدة' },
            { key: 'run', name: 'جري', baseValue: 90, unit: 'دقيقة' },
            { key: 'jumps', name: 'قفز', baseValue: 500, unit: 'عدة' },
            { key: 'situps', name: 'تمرين البطن', baseValue: 500, unit: 'عدة' }
        ]
    }
};