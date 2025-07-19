import { Storage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            event.preventDefault(); // منع تحديث الصفحة

            const name = document.getElementById('name').value;
            const age = parseInt(document.getElementById('age').value);
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const bloodType = document.getElementById('bloodType').value;

            if (name && !isNaN(age) && !isNaN(height) && !isNaN(weight) && bloodType) {
                Storage.registerUser(name, age, height, weight, bloodType);
                alert('تم التسجيل بنجاح! مرحباً بك في System SSS.');
                // **التعديل الجديد: التوجيه مباشرة إلى لوحة التحكم بعد التسجيل**
                window.location.href = 'dashboard.html';
            } else {
                alert('الرجاء ملء جميع الحقول بشكل صحيح.');
            }
        });
    }
});