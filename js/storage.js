// js/storage.js

export const Storage = {
    // المفاتيح المستخدمة في LocalStorage
    KEYS: {
        IS_REGISTERED: 'is_registered',
        USER_DETAILS: 'user_details',
        USER_RANK: 'user_rank',
        USER_POINTS: 'user_points',
        LAST_DAILY_RESET_DATE: 'last_daily_reset_date',
        DAILY_EXERCISE_STATUS: 'daily_exercise_status',
        CONSECUTIVE_DAYS_COMPLETED: 'consecutive_days_completed',
        DAILY_EXERCISE_ADJUSTMENTS: 'daily_exercise_adjustments' // لتخزين تعديلات التمارين بسبب العقوبات
    },

    // حفظ البيانات
    saveItem: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // قراءة البيانات
    getItem: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    // إزالة البيانات
    removeItem: function(key) {
        localStorage.removeItem(key);
    },

    // ------------- وظائف خاصة بالمستخدم -----------------

    // حفظ تفاصيل المستخدم
    saveUserDetails: function(details) {
        this.saveItem(this.KEYS.USER_DETAILS, details);
        this.saveItem(this.KEYS.IS_REGISTERED, true);
    },

    // الحصول على تفاصيل المستخدم
    getUserDetails: function() {
        return this.getItem(this.KEYS.USER_DETAILS);
    },

    // التحقق مما إذا كان المستخدم مسجلاً
    isUserRegistered: function() {
        return this.getItem(this.KEYS.IS_REGISTERED) === true;
    },

    // حفظ رتبة المستخدم
    saveUserRank: function(rank) {
        this.saveItem(this.KEYS.USER_RANK, rank);
    },

    // الحصول على رتبة المستخدم
    getUserRank: function() {
        return this.getItem(this.KEYS.USER_RANK) || "E"; // القيمة الافتراضية E
    },

    // حفظ نقاط المستخدم
    saveUserPoints: function(points) {
        this.saveItem(this.KEYS.USER_POINTS, points);
    },

    // الحصول على نقاط المستخدم
    getUserPoints: function() {
        return this.getItem(this.KEYS.USER_POINTS) || 0;
    },

    // حفظ تاريخ آخر إعادة تعيين يومية (Timestamp)
    saveLastDailyResetDate: function(timestamp) {
        this.saveItem(this.KEYS.LAST_DAILY_RESET_DATE, timestamp);
    },

    // الحصول على تاريخ آخر إعادة تعيين يومية
    getLastDailyResetDate: function() {
        return this.getItem(this.KEYS.LAST_DAILY_RESET_DATE) || 0;
    },

    // حفظ حالة إكمال تمارين اليوم (كائن يحتوي على true/false لكل تمرين)
    saveDailyExerciseStatus: function(status) {
        this.saveItem(this.KEYS.DAILY_EXERCISE_STATUS, status);
    },

    // الحصول على حالة إكمال تمارين اليوم
    getDailyExerciseStatus: function() {
        // قيم افتراضية إذا لم يتم تخزين الحالة بعد
        return this.getItem(this.KEYS.DAILY_EXERCISE_STATUS) || {
            pushups: false,
            run: false,
            jump: false,
            situps: false
        };
    },

    // إعادة تعيين حالة تمارين اليوم إلى غير مكتملة
    resetDailyExerciseStatus: function() {
        this.saveDailyExerciseStatus({
            pushups: false,
            run: false,
            jump: false,
            situps: false
        });
    },

    // حفظ عدد الأيام المتتالية المكتملة
    saveConsecutiveDaysCompleted: function(days) {
        this.saveItem(this.KEYS.CONSECUTIVE_DAYS_COMPLETED, days);
    },

    // الحصول على عدد الأيام المتتالية المكتملة
    getConsecutiveDaysCompleted: function() {
        return this.getItem(this.KEYS.CONSECUTIVE_DAYS_COMPLETED) || 0;
    },

    // حفظ تعديلات التمارين بسبب العقوبات
    saveDailyExerciseAdjustments: function(adjustments) {
        this.saveItem(this.KEYS.DAILY_EXERCISE_ADJUSTMENTS, adjustments);
    },

    // الحصول على تعديلات التمارين بسبب العقوبات
    getDailyExerciseAdjustments: function() {
        return this.getItem(this.KEYS.DAILY_EXERCISE_ADJUSTMENTS) || {
            pushups: 0,
            runMinutes: 0,
            jumps: 0,
            situps: 0
        };
    },

    // مسح جميع بيانات المستخدم (لأغراض الاختبار أو تسجيل الخروج)
    clearAllUserData: function() {
        for (const key in this.KEYS) {
            this.removeItem(this.KEYS[key]);
        }
    }
};