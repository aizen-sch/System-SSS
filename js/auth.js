// js/auth.js

import { Storage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // هذا الجزء خاص بصفحة التسجيل registration.html
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault(); // منع إرسال النموذج الافتراضي

            const name = document.getElementById('name').value.trim();
            const age = document.getElementById('age').value.trim();
            const height = document.getElementById('height').value.trim();
            const weight = document.getElementById('weight').value.trim();
            const bloodType = document.getElementById('bloodType').value.trim();

            // التحقق من أن جميع الحقول غير فارغة
            if (!name || !age || !height || !weight || !bloodType) {
                alert('الرجاء ملء جميع الحقول.');
                return;
            }

            // حفظ بيانات المستخدم
            const userDetails = { name, age, height, weight, bloodType };
            Storage.saveUserDetails(userDetails);
            Storage.saveUserRank("E"); // تعيين الرتبة الأولية E
            Storage.saveUserPoints(0); // تعيين النقاط الأولية 0
            Storage.saveLastDailyResetDate(Date.now()); // حفظ تاريخ التسجيل كأول يوم
            Storage.saveConsecutiveDaysCompleted(0); // إعادة تعيين أيام الإكمال المتتالية
            Storage.resetDailyExerciseStatus(); // إعادة تعيين حالة التمارين اليومية
            Storage.saveDailyExerciseAdjustments({ pushups: 0, runMinutes: 0, jumps: 0, situps: 0 }); // إعادة تعيين تعديلات العقوبات

            alert('تم التسجيل بنجاح! سيتم توجيهك الآن إلى لوحة التحكم.');
            window.location.href = 'dashboard.html'; // التوجيه إلى لوحة التحكم
        });
    }

    // هذا الجزء يمكن أن يكون في app.js ولكن وضعته هنا للتبسيط
    // لصفحة index.html للتحقق من التسجيل
    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')) {
        if (Storage.isUserRegistered()) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'registration.html';
        }
    }
});