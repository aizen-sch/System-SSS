// js/ui.js

import { Storage } from './storage.js';
import { EXERCISES_BY_RANK, PENALTY_RATIO_EXERCISE } from './data.js';

// تحديث عرض اسم المستخدم، الرتبة، والنقاط في لوحة التحكم
export function updateDashboardHeader() {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRankDisplay = document.getElementById('userRankDisplay');
    const userPointsDisplay = document.getElementById('userPointsDisplay');

    if (userNameDisplay) {
        const userDetails = Storage.getUserDetails();
        userNameDisplay.textContent = `أهلاً بك يا ${userDetails ? userDetails.name : 'مستخدم'}!`;
    }
    if (userRankDisplay) {
        userRankDisplay.textContent = Storage.getUserRank();
    }
    if (userPointsDisplay) {
        userPointsDisplay.textContent = Storage.getUserPoints();
    }
}

// عرض معلومات المستخدم في صفحة user_info.html
export function displayUserInfo() {
    const userDetails = Storage.getUserDetails();
    if (userDetails) {
        document.getElementById('infoName').textContent = userDetails.name;
        document.getElementById('infoAge').textContent = userDetails.age;
        document.getElementById('infoHeight').textContent = userDetails.height;
        document.getElementById('infoWeight').textContent = userDetails.weight;
        document.getElementById('infoBloodType').textContent = userDetails.bloodType;
    }
}

// تحديث عرض التمارين اليومية
export function updateDailyExercisesDisplay(currentRank, dailyStatus, adjustments) {
    const exercisesList = document.getElementById('dailyExercisesList');
    if (!exercisesList) return;

    exercisesList.innerHTML = ''; // مسح القائمة الحالية

    const rankExercises = EXERCISES_BY_RANK[currentRank];
    if (!rankExercises) {
        exercisesList.innerHTML = '<li>لا توجد تمارين محددة لهذه الرتبة.</li>';
        return;
    }

    // تطبيق التعديلات بسبب العقوبات (إذا كانت الرتبة أقل من S)
    const currentAdjustments = currentRank < 'S' ? adjustments : { pushups: 0, runMinutes: 0, jumps: 0, situps: 0 };

    const exercises = [
        { key: 'pushups', name: 'عداد ضغط', value: rankExercises.pushups + currentAdjustments.pushups, unit: 'عدة' },
        { key: 'run', name: 'ركض', value: rankExercises.runMinutes + currentAdjustments.runMinutes, unit: 'دقيقة' },
        { key: 'jump', name: 'جومبا', value: rankExercises.jumps + currentAdjustments.jumps, unit: 'عدة' },
        { key: 'situps', name: 'بطن', value: rankExercises.situps + currentAdjustments.situps, unit: 'عدة' }
    ];

    exercises.forEach(ex => {
        const listItem = document.createElement('li');
        const isCompleted = dailyStatus[ex.key + 's'] || dailyStatus[ex.key]; // ليتوافق مع المفاتيح "pushups" و "run"
        listItem.classList.toggle('completed', isCompleted);

        listItem.innerHTML = `
            <span>${ex.name}: ${ex.value} ${ex.unit}</span>
            <button data-exercise-key="${ex.key}" ${isCompleted ? 'disabled class="disabled"' : ''}>
                ${isCompleted ? 'تم الإنجاز' : 'تم'}
            </button>
        `;
        exercisesList.appendChild(listItem);
    });

    // تحديث زر "أكملت جميع المهام"
    const completeAllBtn = document.getElementById('completeAllBtn');
    const allExercisesDone = Object.values(dailyStatus).every(status => status === true);
    if (completeAllBtn) {
        if (allExercisesDone) {
            completeAllBtn.style.display = 'block';
            completeAllBtn.disabled = true;
            completeAllBtn.classList.add('disabled');
        } else {
            completeAllBtn.style.display = 'none';
        }
    }
}

// تحديث عرض العداد
export function updateTimerDisplay(remainingMillis) {
    const timerDisplay = document.getElementById('countdownTimer');
    if (!timerDisplay) return;

    if (remainingMillis <= 0) {
        timerDisplay.textContent = '00:00:00';
        timerDisplay.classList.remove('red-alert');
        timerDisplay.classList.add('green-complete');
        return;
    }

    const totalSeconds = Math.floor(remainingMillis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = [hours, minutes, seconds]
        .map(unit => unit.toString().padStart(2, '0'))
        .join(':');

    timerDisplay.textContent = formattedTime;

    // تغيير لون العداد بناءً على الوقت المتبقي
    // مثلاً، إذا بقي أقل من ساعة واحدة (3600000 مللي ثانية)
    if (remainingMillis < 3600000 && remainingMillis > 0) {
        timerDisplay.classList.add('red-alert');
        timerDisplay.classList.remove('green-complete');
    } else {
        timerDisplay.classList.remove('red-alert');
        timerDisplay.classList.add('green-complete');
    }
}