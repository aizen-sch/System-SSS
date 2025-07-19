// js/app.js

import { Storage } from './storage.js';
import { EXERCISES_BY_RANK, RANKS, RANK_UP_POINTS, PENALTY_RATIO_POINTS, PENALTY_EXERCISE_INCREASE_RATIO } from './data.js';
import { updateDashboardHeader, updateDailyExercisesDisplay, displayUserInfo, startTimer, stopTimer } from './ui.js';

let dailyTimerInterval; // لتخزين معرف العداد

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // تهيئة الموقع عند التحميل
    if (path.endsWith('/index.html') || path === '/') {
        if (!Storage.isUserRegistered()) {
            window.location.href = 'registration.html';
        } else {
            // إذا كان المستخدم مسجلاً، ادخله مباشرة إلى لوحة التحكم
            window.location.href = 'dashboard.html';
        }
    } else if (path.endsWith('/registration.html')) {
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const name = document.getElementById('name').value;
                const age = parseInt(document.getElementById('age').value);
                const height = parseFloat(document.getElementById('height').value);
                const weight = parseFloat(document.getElementById('weight').value);
                const bloodType = document.getElementById('bloodType').value;

                if (name && !isNaN(age) && !isNaN(height) && !isNaN(weight) && bloodType) {
                    Storage.registerUser(name, age, height, weight, bloodType);
                    alert('تم التسجيل بنجاح! مرحباً بك في System SSS.');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('الرجاء ملء جميع الحقول بشكل صحيح.');
                }
            });
        }
    } else if (path.endsWith('/dashboard.html')) {
        if (!Storage.isUserRegistered()) {
            window.location.href = 'registration.html';
            return; // توقف عن تنفيذ بقية الكود إذا لم يكن مسجلاً
        }

        // تحقق من إعادة تعيين اليومي عند تحميل لوحة التحكم
        checkDailyResetNeeded();
        
        // تحديث الواجهة عند تحميل لوحة التحكم
        updateDashboardHeader();
        const userRank = Storage.getUserRank();
        const dailyStatus = Storage.getDailyExerciseStatus();
        const adjustments = Storage.getDailyExerciseAdjustments();
        updateDailyExercisesDisplay(userRank, dailyStatus, adjustments);

        // بدء العداد اليومي
        startDailyTimer();

        // ربط أزرار إكمال التمارين
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('complete-btn')) {
                const exerciseKey = event.target.dataset.exerciseKey;
                completeExercise(exerciseKey);
            }
        });

        // ربط زر "معلوماتي"
        const viewInfoBtn = document.getElementById('viewInfoBtn');
        if (viewInfoBtn) {
            viewInfoBtn.addEventListener('click', () => {
                window.location.href = 'user_info.html';
            });
        }

        // زر "أكملت جميع المهام لهذا اليوم!" (لن يظهر أو يتم تفعيله إلا بعد إكمال الكل)
        const completeAllBtn = document.getElementById('completeAllBtn');
        if (completeAllBtn) {
             // زر إكمال الكل لا يفعل شيء بنفسه الآن، فهو فقط مؤشر مرئي
             // النقاط يتم إضافتها في completeExercise()
        }

    } else if (path.endsWith('/user_info.html')) {
        if (!Storage.isUserRegistered()) {
            window.location.href = 'registration.html';
            return;
        }
        displayUserInfo(); // عرض معلومات المستخدم

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
        }
    }
});


/**
 * التعامل مع إكمال تمرين واحد.
 * هذا هو المكان الذي تتم فيه إضافة النقاط فورًا بعد إكمال جميع التمارين.
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
            completeAllBtn.style.display = 'block'; // إظهار الزر
            completeAllBtn.disabled = true; // تعطيل الزر
            completeAllBtn.classList.add('disabled'); // إضافة كلاس لجعله يبدو معطلاً
        }

        // ****** منطق إضافة النقاط فوراً يبدأ هنا ******
        let currentUserPoints = Storage.getUserPoints();
        const currentRank = Storage.getUserRank();
        const rankPoints = EXERCISES_BY_RANK[currentRank].points; // النقاط المستحقة لهذه الرتبة

        Storage.saveUserPoints(currentUserPoints + rankPoints); // إضافة النقاط وحفظها

        // إعادة تعيين تعديلات العقوبات فوراً بعد إكمال المهام
        // هذا يضمن أن العقوبات يتم مسحها لليوم التالي بعد إكمال مهام اليوم الحالي
        Storage.saveDailyExerciseAdjustments({ pushups: 0, runMinutes: 0, jumps: 0, situps: 0 });

        // زيادة الأيام المتتالية المكتملة
        let consecutiveDays = Storage.getConsecutiveDaysCompleted();
        consecutiveDays++;
        Storage.saveConsecutiveDaysCompleted(consecutiveDays);

        // تحديث الواجهة لعرض النقاط والرتبة الجديدة فوراً
        updateDashboardHeader();
        
        // التحقق من الترقية بناءً على الأيام المتتالية المكتملة (إذا كان مؤهلاً)
        // هذا الشرط للترقية فقط إذا لم يكن قد وصل لرتبة S أو أعلى
        const currentRankIndex = RANKS.indexOf(currentRank);
        const sRankIndex = RANKS.indexOf('S');

        if (consecutiveDays >= 7 && currentRankIndex < RANKS.length -1 && currentRankIndex < sRankIndex) { 
            const nextRank = RANKS[currentRankIndex + 1];
            Storage.saveUserRank(nextRank);
            alert(`تهانينا! لقد أكملت 7 أيام متتالية وتمت ترقيتك إلى الرتبة: ${nextRank}!`);
            Storage.saveConsecutiveDaysCompleted(0); // إعادة تعيين الأيام المتتالية بعد الترقية
            // بعد الترقية، يجب أن تتغير التمارين لليوم التالي
            // سيتم التعامل مع هذا في checkDailyResetNeeded
        }
        
        // التحقق من الترقية بناءً على النقاط (بعد تحديثها)
        checkAndUpgradeRank();

        // رسالة تأكيد للمستخدم
        alert(`تهانينا! لقد أكملت جميع مهام اليوم وحصلت على ${rankPoints} نقطة!`);
        // ****** منطق إضافة النقاط ينتهي هنا ******
    }
}

/**
 * دالة للتحقق من الترقية بناءً على النقاط.
 * يتم استدعاؤها بعد أي تغيير في النقاط أو عند تحميل لوحة التحكم.
 */
function checkAndUpgradeRank() {
    let currentUserPoints = Storage.getUserPoints();
    let currentUserRank = Storage.getUserRank();
    const currentRankIndex = RANKS.indexOf(currentUserRank);

    // تحقق من الترقية بناءً على النقاط
    // نمر على الرتب من الرتبة الحالية صعوداً
    for (let i = currentRankIndex + 1; i < RANKS.length; i++) {
        const nextRank = RANKS[i];
        const pointsRequiredForNextRank = RANK_UP_POINTS[nextRank];

        // بالنسبة لرتبة GODS، لا يوجد ترقية أعلى منها، فقط استمرار جمع النقاط
        if (nextRank === 'GODS') {
            if (currentUserPoints >= pointsRequiredForNextRank && currentUserRank !== 'GODS') {
                Storage.saveUserRank(nextRank);
                alert(`مبروك! وصلت نقاطك إلى ${currentUserPoints} وتمت ترقيتك إلى الرتبة الأسطورية: GODS!`);
                updateDashboardHeader();
                // لا نحتاج لتغيير التمارين هنا، لأنها ستتغير مع الرتبة الجديدة
                // وسيتم التعامل مع التمارين لليوم التالي في checkDailyResetNeeded
                return; // توقف بعد الترقية النهائية
            }
            continue; // استمر في اللفة إذا لم يتم الترقية بعد
        }

        if (currentUserPoints >= pointsRequiredForNextRank && currentUserRank !== nextRank) {
            Storage.saveUserRank(nextRank);
            alert(`مبروك! وصلت نقاطك إلى ${currentUserPoints} وتمت ترقيتك إلى الرتبة: ${nextRank}!`);
            updateDashboardHeader();
            // بعد الترقية، الرتبة قد تغيرت، مما يعني تمارين جديدة
            // هذا سيؤثر على ما سيتم تحميله في اليوم الجديد
            // سيتم التعامل مع التمارين لليوم التالي في checkDailyResetNeeded
            currentUserRank = nextRank; // تحديث الرتبة المحلية للمتابعة في الحلقة
        } else {
            // إذا لم تكن النقاط كافية للرتبة التالية، فلا داعي للتحقق من الرتب الأعلى
            break;
        }
    }
}


/**
 * دالة لبدء العداد اليومي.
 */
function startDailyTimer() {
    stopTimer(dailyTimerInterval); // أوقف أي عداد سابق
    
    const lastResetTimestamp = Storage.getLastDailyResetDate();
    const now = Date.now();

    // احسب بداية اليوم الحالي (منتصف الليل)
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // احسب نهاية اليوم الحالي (نهاية منتصف الليل التالي)
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const timeRemaining = tomorrowStart.getTime() - now; // الوقت المتبقي بالمللي ثانية

    if (timeRemaining > 0) {
        // ابدأ العداد باستخدام دالة startTimer من UI
        dailyTimerInterval = startTimer('countdownTimer', timeRemaining, () => {
            // هذا الكولباك يتم تشغيله عندما ينتهي العداد (أي في منتصف الليل)
            checkDailyResetNeeded(); // نفذ إعادة التعيين لليوم الجديد
            startDailyTimer(); // أعد تشغيل العداد لليوم الجديد
        });
    } else {
        // إذا كان الوقت المتبقي سالبًا أو صفرًا، فهذا يعني أننا تجاوزنا منتصف الليل
        // يجب أن يتم إعادة التعيين فوراً ثم بدء العداد لليوم الجديد
        checkDailyResetNeeded();
        startDailyTimer();
    }
}

/**
 * التحقق من إعادة تعيين التمارين اليومية وتطبيق العقوبات/المكافآت.
 */
function checkDailyResetNeeded() {
    const lastResetTimestamp = Storage.getLastDailyResetDate();
    const now = Date.now();
    
    // إذا لم يكن اليوم هو نفس يوم آخر إعادة تعيين، فهذا يوم جديد
    if (!isSameDay(lastResetTimestamp, now)) {
        const dailyStatus = Storage.getDailyExerciseStatus();
        const allExercisesDone = Object.values(dailyStatus).every(status => status === true);

        let currentUserPoints = Storage.getUserPoints(); 
        let currentUserRank = Storage.getUserRank();
        let consecutiveDays = Storage.getConsecutiveDaysCompleted(); 
        let currentAdjustments = Storage.getDailyExerciseAdjustments(); 
        
        const sRankIndex = RANKS.indexOf('S');
        const currentRankIndex = RANKS.indexOf(currentUserRank);

        // تطبيق العقوبة فقط إذا لم تكتمل المهام في اليوم السابق والرتبة أقل من S
        if (!allExercisesDone && currentRankIndex < sRankIndex) {
            const { newPoints, newAdjustments } = applyPenalty(currentUserRank, currentUserPoints, currentAdjustments);
            Storage.saveUserPoints(newPoints); // حفظ النقاط بعد الخصم
            Storage.saveDailyExerciseAdjustments(newAdjustments); // حفظ تعديلات العقوبات
            alert(`لم تكمل مهام الأمس! تم خصم ${Math.floor(currentUserPoints - newPoints)} نقطة. وزادت صعوبة بعض تمارينك.`);
            consecutiveDays = 0; // إعادة تعيين الأيام المتتالية عند عدم الإكمال
            Storage.saveConsecutiveDaysCompleted(consecutiveDays); // حفظ تحديث الأيام المتتالية
        } else if (allExercisesDone) {
            // إذا أكمل جميع المهام في اليوم السابق، الأيام المتتالية تزداد (تم التعامل معها بالفعل في completeExercise)
            // ولا يتم خصم نقاط ولا عقوبات
        } else if (!allExercisesDone && currentRankIndex >= sRankIndex) {
            // لا يتم تطبيق عقوبات على رتبة S فما فوق
            alert('لم تكمل مهام الأمس، لكن العقوبات لا تطبق على رتبتك (S فما فوق).');
            consecutiveDays = 0; // إعادة تعيين الأيام المتتالية حتى لو لم يكن هناك خصم نقاط
            Storage.saveConsecutiveDaysCompleted(consecutiveDays);
        }
        
        // دائماً قم بتحديث تاريخ آخر إعادة تعيين وحالة التمارين لليوم الجديد
        Storage.saveLastDailyResetDate(now);
        // إعادة تعيين التمارين لليوم الجديد (كلها false) بناءً على الرتبة الحالية
        Storage.resetDailyExerciseStatus();

        // تحديث الواجهة بعد أي تغييرات (مثل خصم النقاط)
        updateDashboardHeader();
        // الحصول على حالة التمارين والتعديلات المحدثة بعد إعادة التعيين
        const updatedStatus = Storage.getDailyExerciseStatus();
        const updatedAdjustments = Storage.getDailyExerciseAdjustments();
        // يجب الحصول على الرتبة المحدثة هنا في حالة وجود ترقية سابقة
        const updatedRank = Storage.getUserRank(); 
        updateDailyExercisesDisplay(updatedRank, updatedStatus, updatedAdjustments);

        // التحقق من الترقية بعد أي خصم نقاط (إذا تم)
        checkAndUpgradeRank();
    }
}

/**
 * دالة مساعدة لتحديد ما إذا كان التاريخان يقعان في نفس اليوم.
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
 * دالة لتطبيق العقوبة (خصم نقاط وزيادة صعوبة التمارين)
 * @param {string} rank - الرتبة الحالية للمستخدم
 * @param {number} currentPoints - نقاط المستخدم الحالية
 * @param {object} currentAdjustments - التعديلات الحالية على التمارين
 * @returns {{newPoints: number, newAdjustments: object}} - النقاط والتعديلات الجديدة
 */
function applyPenalty(rank, currentPoints, currentAdjustments) {
    const penaltyAmount = Math.floor(currentPoints * PENALTY_RATIO_POINTS);
    const newPoints = Math.max(0, currentPoints - penaltyAmount); // لا يمكن أن تكون النقاط أقل من صفر

    const newAdjustments = { ...currentAdjustments }; // نسخ التعديلات الحالية
    
    // زيادة صعوبة التمارين بنسبة (1/3 = 33%) من القيمة الأساسية
    const penaltyIncreaseRatio = PENALTY_EXERCISE_INCREASE_RATIO; 

    // زيادة صعوبة تمارين معينة بناءً على الرتبة
    const exercisesForRank = EXERCISES_BY_RANK[rank].exercises;
    exercisesForRank.forEach(ex => {
        if (ex.key === 'pushups') {
            newAdjustments.pushups = (newAdjustments.pushups || 0) + Math.ceil(ex.baseValue * penaltyIncreaseRatio);
        } else if (ex.key === 'run') {
            newAdjustments.runMinutes = (newAdjustments.runMinutes || 0) + Math.ceil(ex.baseValue * penaltyIncreaseRatio);
        } else if (ex.key === 'jumps') {
            newAdjustments.jumps = (newAdjustments.jumps || 0) + Math.ceil(ex.baseValue * penaltyIncreaseRatio);
        } else if (ex.key === 'situps') {
            newAdjustments.situps = (newAdjustments.situps || 0) + Math.ceil(ex.baseValue * penaltyIncreaseRatio);
        }
        // يمكن إضافة المزيد من التمارين هنا
    });

    return { newPoints, newAdjustments };
}