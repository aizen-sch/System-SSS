// js/app.js

import { Storage } from './storage.js';
import { EXERCISES_BY_RANK, RANK_UP_POINTS, RANKS, PENALTY_RATIO_POINTS, PENALTY_RATIO_EXERCISE } from './data.js';
import { updateDashboardHeader, updateDailyExercisesDisplay, updateTimerDisplay, displayUserInfo } from './ui.js';

let countdownInterval; // متغير للاحتفاظ بمعرف العداد

// ------------------------------------------------------------------
// وظائف مساعدة عامة
// ------------------------------------------------------------------

/**
 * تحقق مما إذا كان التاريخ هو نفس اليوم (فقط اليوم/الشهر/السنة)
 * @param {number} timestamp1
 * @param {number} timestamp2
 * @returns {boolean}
 */
function isSameDay(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

/**
 * الحصول على نهاية اليوم الحالي (timestamp)
 * @returns {number}
 */
function getEndOfToday() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return endOfDay.getTime();
}

// ------------------------------------------------------------------
// منطق التمارين والنقاط والرتب
// ------------------------------------------------------------------

/**
 * تحديث رتبة المستخدم بناءً على نقاطه
 */
function checkAndUpgradeRank() {
    let currentUserRank = Storage.getUserRank();
    let currentUserPoints = Storage.getUserPoints();

    let newRank = currentUserRank;

    for (const rank of RANKS) {
        const rankData = RANK_UP_POINTS[rank];
        if (rankData && rankData.nextRank) {
            if (currentUserPoints >= rankData.min && currentUserPoints <= rankData.max) {
                newRank = rank;
                break; // وجدنا الرتبة الصحيحة للنقاط الحالية
            } else if (currentUserPoints > rankData.max) {
                newRank = rankData.nextRank; // قد يكون مؤهلاً للرتبة التالية
            }
        } else if (rank === "GODS" && currentUserPoints >= RANK_UP_POINTS["GODS"].min) {
            newRank = "GODS";
            break;
        }
    }

    if (newRank !== currentUserRank) {
        Storage.saveUserRank(newRank);
        alert(`تهانينا! لقد تمت ترقيتك إلى الرتبة: ${newRank}`);
        updateDashboardHeader(); // تحديث الواجهة فوراً
    }
}

/**
 * تطبيق عقوبة عدم إكمال التمارين
 * @param {string} currentRank
 * @param {number} userPoints
 * @param {object} adjustments
 * @returns {object} { newPoints, newAdjustments }
 */
function applyPenalty(currentRank, userPoints, adjustments) {
    let newPoints = userPoints;
    let newAdjustments = { ...adjustments }; // نسخة لتجنب التعديل المباشر

    // يتم إيقاف نظام العقوبات عند وصول الرتبة S
    if (RANKS.indexOf(currentRank) >= RANKS.indexOf("S")) {
        return { newPoints, newAdjustments };
    }

    // خصم النقاط
    const pointsToDeduct = Math.floor(userPoints * PENALTY_RATIO_POINTS);
    newPoints = Math.max(0, userPoints - pointsToDeduct); // لا يمكن أن تكون النقاط أقل من 0

    // إضافة 1/3 إلى التمرين القادم
    // هذه ستحتاج لمنطق أكثر تعقيداً لتحديد أي تمرين يتم زيادته
    // حالياً، سأضيفها بشكل متساوٍ لجميع التمارين الممكنة كتعديل دائم حتى يتم إنجازها
    // أو يمكن تحديدها لأول تمرين لم يتم إكماله. للتبسيط، سأفترض أنها تزيد كل التمارين بشكل عام.
    // أو يمكننا اعتبارها زيادة مؤقتة لكل التمارين في اليوم التالي.
    // لتبسيط هذا الجزء في البداية: سأفترض أنها زيادة على جميع التمارين *الحالية* للرتبة
    // كعقوبة تجعل التمارين التالية أصعب، وتظل حتى يتم تجاوزها.
    // هذه النقطة تتطلب توضيحاً إضافياً "اضافة 1/3 الى تمرينه قادم". هل هو تمرين واحد؟ هل هو تمرين معين؟
    // لغرض التنفيذ الحالي، سأجعلها تزيد من صعوبة التمارين الحالية (للرتبة) بشكل دائم حتى تُكمل.
    // هذا يعني أننا سنخزن هذه التعديلات ونضيفها إلى متطلبات التمارين.

    const currentRankExercises = EXERCISES_BY_RANK[currentRank];
    if (currentRankExercises) {
        newAdjustments.pushups += Math.ceil(currentRankExercises.pushups * PENALTY_RATIO_EXERCISE);
        newAdjustments.runMinutes += Math.ceil(currentRankExercises.runMinutes * PENALTY_RATIO_EXERCISE);
        newAdjustments.jumps += Math.ceil(currentRankExercises.jumps * PENALTY_RATIO_EXERCISE);
        newAdjustments.situps += Math.ceil(currentRankExercises.situps * PENALTY_RATIO_EXERCISE);
    }

    return { newPoints, newAdjustments };
}


/**
 * التحقق من إعادة تعيين التمارين اليومية وتطبيق العقوبات/المكافآت
 */
function checkDailyResetNeeded() {
    const lastResetTimestamp = Storage.getLastDailyResetDate();
    const now = Date.now();
    const endOfLastResetDay = new Date(lastResetTimestamp);
    endOfLastResetDay.setHours(23, 59, 59, 999);

    // إذا لم يكن اليوم هو نفس يوم آخر إعادة تعيين، فهذا يوم جديد
    if (!isSameDay(lastResetTimestamp, now)) {
        const dailyStatus = Storage.getDailyExerciseStatus();
        const allExercisesDone = Object.values(dailyStatus).every(status => status === true);

        let currentUserPoints = Storage.getUserPoints();
        let currentUserRank = Storage.getUserRank();
        let consecutiveDays = Storage.getConsecutiveDaysCompleted();
        let currentAdjustments = Storage.getDailyExerciseAdjustments();

        // إذا كانت التمارين لم تكتمل في اليوم السابق وتوجد عقوبات
        if (!allExercisesDone) {
            // تطبيق العقوبة فقط إذا كانت الرتبة أقل من S
            if (RANKS.indexOf(currentUserRank) < RANKS.indexOf("S")) {
                const { newPoints, newAdjustments } = applyPenalty(currentUserRank, currentUserPoints, currentAdjustments);
                Storage.saveUserPoints(newPoints);
                Storage.saveDailyExerciseAdjustments(newAdjustments);
                alert(`لم تكمل مهام الأمس! تم خصم ${Math.floor(currentUserPoints * PENALTY_RATIO_POINTS)} نقطة. وزادت صعوبة بعض تمارينك.`);
                consecutiveDays = 0; // إعادة تعيين الأيام المتتالية
            }
        } else {
            // إذا كانت التمارين قد اكتملت في اليوم السابق
            const rankPoints = EXERCISES_BY_RANK[currentUserRank].points;
            Storage.saveUserPoints(currentUserPoints + rankPoints);
            consecutiveDays++; // زيادة الأيام المتتالية
            // إعادة تعيين التعديلات لأن المستخدم أكمل المهام
            Storage.saveDailyExerciseAdjustments({ pushups: 0, runMinutes: 0, jumps: 0, situps: 0 });
        }

        Storage.saveConsecutiveDaysCompleted(consecutiveDays);
        Storage.saveLastDailyResetDate(now); // تحديث تاريخ آخر إعادة تعيين لليوم الحالي
        Storage.resetDailyExerciseStatus(); // إعادة تعيين حالة التمارين لليوم الجديد

        // التحقق من الترقية بناءً على الأيام المتتالية إذا لم يكن قد تم بالفعل بالنقاط
        if (consecutiveDays >= 7) {
            const currentRankIndex = RANKS.indexOf(currentUserRank);
            if (currentRankIndex < RANKS.length - 1) { // ليس الرتبة الأخيرة
                const nextRank = RANKS[currentRankIndex + 1];
                Storage.saveUserRank(nextRank);
                alert(`تهانينا! لقد أكملت 7 أيام متتالية وتمت ترقيتك إلى الرتبة: ${nextRank}!`);
                Storage.saveConsecutiveDaysCompleted(0); // إعادة تعيين بعد الترقية بالأيام
            }
        }

        // تحقق من الترقية بناءً على النقاط بعد تحديثها
        checkAndUpgradeRank();
    }
}

/**
 * بدء العداد التنازلي لليوم الحالي
 */
function startDailyTimer() {
    // إيقاف أي عداد سابق لتجنب التكرار
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    const updateTimer = () => {
        const now = Date.now();
        const endOfToday = getEndOfToday();
        let remainingMillis = endOfToday - now;

        updateTimerDisplay(remainingMillis);

        if (remainingMillis <= 0) {
            clearInterval(countdownInterval);
            // بمجرد انتهاء العداد، نتحقق من إعادة التعيين لليوم الجديد
            checkDailyResetNeeded();
            // قد تحتاج إلى إعادة تحميل الصفحة أو تحديث شامل لواجهة المستخدم هنا
            // window.location.reload(); // خيار لإعادة تحميل كاملة
            // أو فقط تحديث الواجهة
            const userRank = Storage.getUserRank();
            const dailyStatus = Storage.getDailyExerciseStatus();
            const adjustments = Storage.getDailyExerciseAdjustments();
            updateDailyExercisesDisplay(userRank, dailyStatus, adjustments);
            updateDashboardHeader();
        }
    };

    updateTimer(); // تحديث فوري عند البدء
    countdownInterval = setInterval(updateTimer, 1000); // تحديث كل ثانية
}

/**
 * التعامل مع إكمال تمرين واحد
 * @param {string} exerciseKey
 */
function completeExercise(exerciseKey) {
    const dailyStatus = Storage.getDailyExerciseStatus();

    // إذا كان التمرين مكتملًا بالفعل، فلا تفعل شيئًا
    if (dailyStatus[exerciseKey]) {
        return;
    }

    dailyStatus[exerciseKey] = true;
    Storage.saveDailyExerciseStatus(dailyStatus);

    // تحديث الواجهة لعكس حالة الإكمال
    const userRank = Storage.getUserRank();
    const adjustments = Storage.getDailyExerciseAdjustments();
    updateDailyExercisesDisplay(userRank, dailyStatus, adjustments);

    // التحقق إذا تم إكمال جميع المهام بعد هذا الإنجاز
    const allExercisesDone = Object.values(dailyStatus).every(status => status === true);
    if (allExercisesDone) {
        const completeAllBtn = document.getElementById('completeAllBtn');
        if (completeAllBtn) {
            completeAllBtn.style.display = 'block';
            completeAllBtn.disabled = true;
            completeAllBtn.classList.add('disabled');
        }
        // يمكننا هنا عرض رسالة تهنئة صغيرة بأنهم أكملوا جميع مهام اليوم
        alert('تهانينا! لقد أكملت جميع مهام اليوم. ستُضاف نقاطك عند بداية اليوم الجديد.');
    }
}

// ------------------------------------------------------------------
// إعداد الأحداث عند تحميل كل صفحة
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // ... (الجزء الخاص بـ index.html و registration.html) ...

    if (path.endsWith('/dashboard.html')) {
        // **هام: التحقق من التسجيل**
        if (!Storage.isUserRegistered()) {
            window.location.href = 'registration.html';
            return; // توقف عن تنفيذ بقية الكود إذا لم يكن مسجلاً
        }

        // عند تحميل لوحة التحكم
        checkDailyResetNeeded(); // تحقق من إعادة التعيين أولاً
        updateDashboardHeader(); // تحديث معلومات الرأس (الاسم، الرتبة، النقاط)
        
        const userRank = Storage.getUserRank();
        const dailyStatus = Storage.getDailyExerciseStatus();
        const adjustments = Storage.getDailyExerciseAdjustments();
        updateDailyExercisesDisplay(userRank, dailyStatus, adjustments); // عرض التمارين

        startDailyTimer() // بدء العداد

        // إضافة مستمعي الأحداث للأزرار
        document.getElementById('viewInfoBtn').addEventListener('click', () => {
            window.location.href = 'user_info.html';
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('هل أنت متأكد من أنك تريد تسجيل الخروج ومسح جميع بياناتك؟')) {
                Storage.clearAllUserData();
                clearInterval(countdownInterval); // إيقاف العداد عند تسجيل الخروج
                window.location.href = 'registration.html';
            }
        });

        // إضافة مستمعي الأحداث لأزرار إكمال التمارين
        document.getElementById('dailyExercisesList').addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON' && !event.target.disabled) {
                const exerciseKey = event.target.dataset.exerciseKey;
                completeExercise(exerciseKey);
            }
        });

        // زر إكمال جميع المهام (لا يحتاج لحدث الآن لأنه سيصبح معطلاً ومخفياً)
        // المنطق يدار تلقائياً عند إكمال آخر تمرين
    } else if (path.endsWith('/user_info.html')) {
        // إذا لم يكن المستخدم مسجلاً، أعد توجيهه لصفحة التسجيل
        if (!Storage.isUserRegistered()) {
            window.location.href = 'registration.html';
            return;
        }
        displayUserInfo(); // عرض معلومات المستخدم
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
});