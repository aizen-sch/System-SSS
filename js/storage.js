// js/storage.js

/**
 * كائن Storage هو واجهة للتفاعل مع LocalStorage.
 * يوفر دوال لحفظ واسترجاع بيانات المستخدم وحالة التطبيق.
 */
export const Storage = {
    /**
     * حفظ معلومات المستخدم بعد التسجيل.
     * @param {string} name - اسم المستخدم.
     * @param {number} age - عمر المستخدم.
     * @param {number} height - طول المستخدم.
     * @param {number} weight - وزن المستخدم.
     * @param {string} bloodType - فصيلة دم المستخدم.
     */
    registerUser: function(name, age, height, weight, bloodType) {
        const userInfo = { name, age, height, weight, bloodType };
        localStorage.setItem('systemSSS_userInfo', JSON.stringify(userInfo));
        // تهيئة البيانات الأولية للمستخدم الجديد
        localStorage.setItem('systemSSS_userRank', 'E'); // الرتبة الافتراضية
        localStorage.setItem('systemSSS_userPoints', '0'); // النقاط الأولية
        localStorage.setItem('systemSSS_lastDailyResetDate', Date.now().toString()); // تاريخ آخر إعادة تعيين لليوم
        localStorage.setItem('systemSSS_dailyExerciseStatus', JSON.stringify({})); // حالة التمارين اليومية (فارغة في البداية)
        localStorage.setItem('systemSSS_consecutiveDaysCompleted', '0'); // الأيام المتتالية المكتملة
        localStorage.setItem('systemSSS_dailyExerciseAdjustments', JSON.stringify({ pushups: 0, runMinutes: 0, jumps: 0, situps: 0 })); // تعديلات التمارين (للعقوبات)
    },

    /**
     * التحقق مما إذا كان المستخدم قد سجل معلوماته من قبل.
     * @returns {boolean} - true إذا كان مسجلاً، false بخلاف ذلك.
     */
    isUserRegistered: function() {
        return localStorage.getItem('systemSSS_userInfo') !== null;
    },

    /**
     * الحصول على معلومات المستخدم.
     * @returns {object|null} - كائن يحتوي على معلومات المستخدم أو null إذا لم يكن مسجلاً.
     */
    getUserInfo: function() {
        const userInfo = localStorage.getItem('systemSSS_userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    },

    /**
     * حفظ رتبة المستخدم.
     * @param {string} rank - الرتبة الجديدة للمستخدم.
     */
    saveUserRank: function(rank) {
        localStorage.setItem('systemSSS_userRank', rank);
    },

    /**
     * الحصول على رتبة المستخدم.
     * @returns {string} - رتبة المستخدم.
     */
    getUserRank: function() {
        return localStorage.getItem('systemSSS_userRank') || 'E'; // الرتبة الافتراضية 'E'
    },

    /**
     * حفظ نقاط المستخدم.
     * @param {number} points - النقاط الجديدة للمستخدم.
     */
    saveUserPoints: function(points) {
        localStorage.setItem('systemSSS_userPoints', points.toString());
    },

    /**
     * الحصول على نقاط المستخدم.
     * @returns {number} - نقاط المستخدم الحالية.
     */
    getUserPoints: function() {
        return parseInt(localStorage.getItem('systemSSS_userPoints') || '0');
    },

    /**
     * حفظ تاريخ آخر إعادة تعيين للتمارين اليومية.
     * @param {number} timestamp - الطابع الزمني لآخر إعادة تعيين.
     */
    saveLastDailyResetDate: function(timestamp) {
        localStorage.setItem('systemSSS_lastDailyResetDate', timestamp.toString());
    },

    /**
     * الحصول على تاريخ آخر إعادة تعيين للتمارين اليومية.
     * @returns {number} - الطابع الزمني لآخر إعادة تعيين، أو 0 إذا لم يكن هناك.
     */
    getLastDailyResetDate: function() {
        return parseInt(localStorage.getItem('systemSSS_lastDailyResetDate') || '0');
    },

    /**
     * حفظ حالة إكمال التمارين اليومية.
     * @param {object} status - كائن يمثل حالة كل تمرين (مكتمل/غير مكتمل).
     */
    saveDailyExerciseStatus: function(status) {
        localStorage.setItem('systemSSS_dailyExerciseStatus', JSON.stringify(status));
    },

    /**
     * الحصول على حالة إكمال التمارين اليومية.
     * @returns {object} - كائن يمثل حالة كل تمرين، أو كائن فارغ إذا لم يكن هناك.
     */
    getDailyExerciseStatus: function() {
        const status = localStorage.getItem('systemSSS_dailyExerciseStatus');
        return status ? JSON.parse(status) : {};
    },

    /**
     * إعادة تعيين حالة التمارين اليومية إلى غير مكتملة.
     */
    resetDailyExerciseStatus: function() {
        const userRank = Storage.getUserRank();
        const exercises = {};
        // تهيئة التمارين لليوم الجديد كغير مكتملة
        // يجب أن يتم جلب التمارين من data.js لتحديد التمارين الخاصة بالرتبة الحالية
        // ولكن للحفاظ على البساطة هنا، نفترض أن لدينا مفاتيح التمارين القياسية
        // هذا الجزء يعتمد على استدعاءات من App.js لتحديد التمارين الفعلية
        // لذا هنا، فقط نُعيد تعيينها لكائن فارغ ليدل على عدم إكمال أي تمرين بعد
        localStorage.setItem('systemSSS_dailyExerciseStatus', JSON.stringify({}));
    },

    /**
     * حفظ الأيام المتتالية المكتملة.
     * @param {number} days - عدد الأيام المتتالية.
     */
    saveConsecutiveDaysCompleted: function(days) {
        localStorage.setItem('systemSSS_consecutiveDaysCompleted', days.toString());
    },

    /**
     * الحصول على عدد الأيام المتتالية المكتملة.
     * @returns {number} - عدد الأيام المتتالية.
     */
    getConsecutiveDaysCompleted: function() {
        return parseInt(localStorage.getItem('systemSSS_consecutiveDaysCompleted') || '0');
    },

    /**
     * حفظ التعديلات على التمارين اليومية (بسبب العقوبات).
     * @param {object} adjustments - كائن يحتوي على التعديلات.
     */
    saveDailyExerciseAdjustments: function(adjustments) {
        localStorage.setItem('systemSSS_dailyExerciseAdjustments', JSON.stringify(adjustments));
    },

    /**
     * الحصول على التعديلات الحالية على التمارين اليومية.
     * @returns {object} - كائن يحتوي على التعديلات، أو كائن افتراضي.
     */
    getDailyExerciseAdjustments: function() {
        const adjustments = localStorage.getItem('systemSSS_dailyExerciseAdjustments');
        return adjustments ? JSON.parse(adjustments) : { pushups: 0, runMinutes: 0, jumps: 0, situps: 0 };
    },

    /**
     * إعادة تعيين جميع بيانات المستخدم في LocalStorage.
     * (مفيدة لزر "تسجيل الخروج / إعادة تعيين البيانات" إذا قررت إعادته).
     */
    resetAllData: function() {
        localStorage.removeItem('systemSSS_userInfo');
        localStorage.removeItem('systemSSS_userRank');
        localStorage.removeItem('systemSSS_userPoints');
        localStorage.removeItem('systemSSS_lastDailyResetDate');
        localStorage.removeItem('systemSSS_dailyExerciseStatus');
        localStorage.removeItem('systemSSS_consecutiveDaysCompleted');
        localStorage.removeItem('systemSSS_dailyExerciseAdjustments');
    }
};