// js/ui.js

import { Storage } from './storage.js';
import { EXERCISES_BY_RANK } from './data.js';

/**
 * تحديث معلومات الرأس في لوحة التحكم (اسم المستخدم، الرتبة، النقاط).
 */
export function updateDashboardHeader() {
    const userInfo = Storage.getUserInfo();
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRankDisplay = document.getElementById('userRankDisplay');
    const userPointsDisplay = document.getElementById('userPointsDisplay');

    if (userNameDisplay) {
        userNameDisplay.textContent = `أهلاً بك يا ${userInfo ? userInfo.name : '[اسم المستخدم]'}!`;
    }
    if (userRankDisplay) {
        userRankDisplay.textContent = Storage.getUserRank();
    }
    if (userPointsDisplay) {
        userPointsDisplay.textContent = Storage.getUserPoints().toString();
    }
}

/**
 * عرض معلومات المستخدم في صفحة معلومات الحساب.
 */
export function displayUserInfo() {
    const userInfo = Storage.getUserInfo();
    if (userInfo) {
        document.getElementById('infoName').textContent = userInfo.name;
        document.getElementById('infoAge').textContent = userInfo.age;
        document.getElementById('infoHeight').textContent = userInfo.height;
        document.getElementById('infoWeight').textContent = userInfo.weight;
        document.getElementById('infoBloodType').textContent = userInfo.bloodType;
    }
}

/**
 * تحديث وعرض قائمة التمارين اليومية.
 * @param {string} userRank - الرتبة الحالية للمستخدم.
 * @param {object} dailyStatus - حالة إكمال كل تمرين (true/false).
 * @param {object} adjustments - التعديلات على قيم التمارين (بسبب العقوبات).
 */
export function updateDailyExercisesDisplay(userRank, dailyStatus, adjustments) {
    const dailyExercisesList = document.getElementById('dailyExercisesList');
    if (!dailyExercisesList) return;

    dailyExercisesList.innerHTML = ''; // مسح القائمة الحالية

    const exercisesForRank = EXERCISES_BY_RANK[userRank]?.exercises || [];

    // إخفاء زر "أكملت جميع المهام لهذا اليوم!" افتراضياً
    const completeAllBtn = document.getElementById('completeAllBtn');
    if (completeAllBtn) {
        completeAllBtn.style.display = 'none';
    }

    let allExercisesCompleted = true; // نفترض أن جميعها مكتملة حتى نجد عكس ذلك

    exercisesForRank.forEach(exercise => {
        const li = document.createElement('li');
        const isCompleted = dailyStatus[exercise.key] || false;
        
        // تطبيق التعديلات على قيمة التمرين
        let adjustedValue = exercise.baseValue;
        if (exercise.key === 'run') {
            adjustedValue += (adjustments.runMinutes || 0);
        } else if (exercise.key === 'pushups') {
            adjustedValue += (adjustments.pushups || 0);
        } else if (exercise.key === 'jumps') {
            adjustedValue += (adjustments.jumps || 0);
        } else if (exercise.key === 'situps') {
            adjustedValue += (adjustments.situps || 0);
        }
        // ضمان ألا تكون القيمة أقل من 1
        adjustedValue = Math.max(1, adjustedValue);

        li.className = 'exercise-item';
        if (isCompleted) {
            li.classList.add('completed');
        } else {
            allExercisesCompleted = false; // إذا وجدنا تمرينًا واحدًا غير مكتمل، فليست كلها مكتملة
        }

        li.innerHTML = `
            <span>${exercise.name}: ${adjustedValue} ${exercise.unit}</span>
            <button class="btn small-btn complete-btn" data-exercise-key="${exercise.key}" ${isCompleted ? 'disabled' : ''}>
                ${isCompleted ? 'تم الإنجاز' : 'إنجاز'}
            </button>
        `;
        dailyExercisesList.appendChild(li);
    });

    // إذا كانت جميع التمارين مكتملة، أظهر زر "أكملت جميع المهام لهذا اليوم!" وقم بتعطيله
    if (allExercisesCompleted) {
        if (completeAllBtn) {
            completeAllBtn.style.display = 'block';
            completeAllBtn.disabled = true;
            completeAllBtn.classList.add('disabled');
        }
    }
}


/**
 * دالة لبدء عداد تنازلي وعرضه.
 * @param {string} elementId - ID العنصر الذي سيعرض العداد.
 * @param {number} durationMs - المدة بالمللي ثانية.
 * @param {function} onComplete - دالة يتم تشغيلها عند انتهاء العداد.
 * @returns {number} - معرف الفاصل الزمني للعداد.
 */
export function startTimer(elementId, durationMs, onComplete) {
    const timerElement = document.getElementById(elementId);
    if (!timerElement) return;

    let remainingTime = durationMs;

    // تحديث العداد كل ثانية
    const interval = setInterval(() => {
        remainingTime -= 1000; // خصم ثانية واحدة

        if (remainingTime <= 0) {
            clearInterval(interval); // إيقاف العداد
            timerElement.textContent = '00:00:00';
            if (onComplete) {
                onComplete(); // تشغيل الدالة عند الانتهاء
            }
            return;
        }

        const totalSeconds = Math.floor(remainingTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // تنسيق الوقت ليظهر كـ HH:MM:SS
        const formattedTime = [hours, minutes, seconds]
            .map(unit => unit < 10 ? '0' + unit : unit)
            .join(':');

        timerElement.textContent = formattedTime;
    }, 1000); // تحديث كل ثانية

    return interval; // إعادة معرف الفاصل الزمني لإيقافه لاحقًا
}

/**
 * دالة لإيقاف العداد.
 * @param {number} intervalId - معرف الفاصل الزمني الذي تم إرجاعه من startTimer.
 */
export function stopTimer(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
    }
}