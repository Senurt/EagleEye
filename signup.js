// Slide Navigation
function nextSlide() {
    if(validateSlide1()) {
        document.getElementById('slide1').style.display = 'none';
        document.getElementById('slide2').style.display = 'block';
        document.getElementById('slideIndicator').innerText = "Step 2: Account Login Information";
    }
}

function prevSlide() {
    document.getElementById('slide1').style.display = 'block';
    document.getElementById('slide2').style.display = 'none';
    document.getElementById('slideIndicator').innerText = "Step 1: Personal Information";
}

// 1. Username Availability Feature
function checkUsername() {
    const username = document.getElementById('username').value;
    const hint = document.getElementById('usernameHint');
    
    // Simulating checking existing accounts in LocalStorage
    const existingAccounts = ['admin', 'operator', 'rescuer1']; 
    
    if (existingAccounts.includes(username.toLowerCase())) {
        hint.innerText = "Username already exists";
        hint.style.color = "#DC2626";
    } else if (username.length > 0) {
        hint.innerText = "Username available";
        hint.style.color = "#16A34A";
    }
}

// 2. Password Strength Metrics (Research-based)
function assessPassword() {
    const pwd = document.getElementById('password').value;
    const bar = document.getElementById('strengthBar');
    const text = document.getElementById('strengthText');
    let strength = 0;

    if (pwd.length >= 8) strength++; // Length
    if (/[A-Z]/.test(pwd)) strength++; // Uppercase
    if (/[0-9]/.test(pwd)) strength++; // Numbers
    if (/[^A-Za-z0-9]/.test(pwd)) strength++; // Symbols

    const colors = ["#DC2626", "#F97316", "#EAB308", "#16A34A"];
    const labels = ["Weak", "Fair", "Good", "Strong"];

    bar.style.width = (strength * 25) + "%";
    bar.style.background = colors[strength - 1] || "#eee";
    text.innerText = labels[strength - 1] || "";
    text.style.color = colors[strength - 1] || "#eee";
}

function validateSlide1() {
    return document.getElementById('fname').value && document.getElementById('lname').value;
}