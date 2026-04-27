const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = usernameInput.value;
    const pass = passwordInput.value;

    // Admin Hardcoded Check
    if (user === 'admin123' && pass === 'admineagleeye') {
        localStorage.setItem('userRole', 'admin');
        window.location.href = 'admin_dashboard.html';
        return;
    }

    // Mock Operator Check
    if (user === 'operator1' && pass === 'password') {
        localStorage.setItem('userRole', 'operator');
        window.location.href = 'operator_dashboard.html';
        return;
    }

    // Mock User Check
    if (user === 'user1' && pass === 'password') {
        localStorage.setItem('userRole', 'user');
        window.location.href = 'user_dashboard.html';
        return;
    }

    // Handle Failures & Lockouts here (as defined in your previous script)
});